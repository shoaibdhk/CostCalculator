const { hash, compare } = require('bcryptjs');
const Joi = require('@hapi/joi');
const { sign } = require('jsonwebtoken');
const { randomBytes } = require('crypto');

const signUpSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .label('Name'),
  email: Joi.string()
    .email()
    .required()
    .label('Invalid')
    .options({
      language: {
        string: {
          email: 'email address'
        }
      }
    }),
  password: Joi.string()
    .min(6)
    .max(14)
    .required()
    .label('Password')
});
const signInSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
    .label('Invalid')
    .options({
      language: {
        string: {
          email: 'email address'
        }
      }
    }),
  password: Joi.string()
    .min(6)
    .max(14)
    .required()
});

const createPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  costs: Joi.array().items(
    Joi.object().keys({
      title: Joi.string().required(),
      price: Joi.number()
        .min(0.01)
        .required()
    })
  )
});
const updatePostSchema = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string(),
  costs: Joi.array().items(
    Joi.object().keys({
      title: Joi.string(),
      price: Joi.number().min(0.01)
    })
  ),
  postId: Joi.string()
});
const Mutation = {
  async signup(parent, args, { prisma, response }, info) {
    const { error } = Joi.validate({ ...args }, signUpSchema, { abortEarly: false });

    if (!error) {
      const password = await hash(args.password, 10);
      const user = await prisma.createUser({ ...args, password });
      let token = sign({ userId: user.id }, process.env.APP_SECRET);
      await response.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365
      });
      return user;
    }

    const errors = {};
    error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')));
    throw new Error(JSON.stringify(errors));
  },
  async signin(parent, args, { prisma, response }, info) {
    const { error } = Joi.validate({ ...args }, signInSchema, { abortEarly: false });

    if (!error) {
      const user = await prisma.user({ email: args.email });

      let isMatched, token;
      if (user) {
        isMatched = await compare(args.password, user.password);
      } else throw new Error(JSON.stringify({ email: 'No user found' }));
      if (isMatched) {
        token = sign({ userId: user.id }, process.env.APP_SECRET);
        await response.cookie('token', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365
        });
        return user;
      } else throw new Error(JSON.stringify({ password: `Password didn't match` }));
    }

    const errors = {};
    error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')));
    throw new Error(JSON.stringify(errors));
  },
  signout(parent, args, { response }, info) {
    response.clearCookie('token');
    return true;
  },

  async createPost(parent, args, { request, prisma }, info) {
    if (!request.userId) throw new Error('No user found');
    const { error } = Joi.validate({ ...args }, createPostSchema, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')));
      throw new Error(JSON.stringify(errors));
    }
    const post = await prisma.createPost({
      ...args,
      costs: { create: [...args.costs] },
      author: { connect: { id: request.userId } }
    });
    return post;
  },

  async deletePost(parent, args, { request, prisma }, info) {
    if (!request.userId) {
      throw new Error('No user found');
    }
    const user = await prisma.post({ id: args.postId }).author();
    if (user.id === request.userId) {
      const post = await prisma.deletePost({ id: args.postId });
      return post;
    } else {
      throw new Error('No posts found');
    }
  },
  async updatePost(parent, args, { prisma, request }, info) {
    if (!request.userId) {
      throw new Error('No user found');
    }
    const { error } = Joi.validate({ ...args }, updatePostSchema, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')));
      throw new Error(JSON.stringify(errors));
    }
    const user = await prisma.post({ id: args.postId }).author();
    if (user.id === request.userId) {
      if (args.costs) {
        const costs = await prisma.deleteManyCostCalculates({ id_gt: 'a' });
        const post = await prisma.updatePost({
          where: { id: args.postId },
          data: {
            title: args.title,
            description: args.description,
            costs: {
              create: [...args.costs]
            }
          }
        });
        return post;
      }
      const post = await prisma.updatePost({
        where: { id: args.postId },
        data: {
          title: args.title,
          description: args.description
        }
      });
      return post;
    } else {
      throw new Error('No posts found');
    }
  }
};

module.exports = Mutation;
