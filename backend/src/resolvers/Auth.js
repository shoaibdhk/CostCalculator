const { hash, compare } = require('bcryptjs');
const Joi = require('@hapi/joi');
const { sign } = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { prisma } = require('../../prisma/generated/prisma-client');

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

const resetPassword = Joi.object().keys({
  token: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .max(14)
    .required(),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .options({
      language: {
        any: {
          allowOnly: 'Passwords do not match'
        }
      }
    })
});

module.exports = {
  async signup(parent, args, { response }, info) {
    const { error } = Joi.validate({ ...args }, signUpSchema, { abortEarly: false });

    if (!error) {
      const password = await hash(args.password, 10);
      const validEmailToken = randomBytes(32).toString('hex');
      const user = await prisma.createUser({ ...args, password, validEmailToken });
      token = sign({ userId: user.id }, process.env.APP_SECRET);
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
  async resetPassword(parent, args, { response }, info) {
    const { error } = Joi.validate({ ...args }, resetPassword, { abortEarly: false });
    if (error) {
      const errors = {};
      error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')));
      throw new Error(JSON.stringify(errors));
    }
    const user = await prisma.users({ where: { resetPasswordToken: args.resetPasswordToken } });
    if (!user) throw new Error('No user found');
    const password = await hash(args.password, 10);

    try {
      const updatePassword = await prisma.user({ id: user.id });
    } catch (e) {
      console.error(e);
    }

    let token = sign({ userId: user.id }, process.env.APP_SECRET);
    await response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
  }
};
