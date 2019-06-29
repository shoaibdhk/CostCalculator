const Joi = require('@hapi/joi')
const auth = require('./Auth')

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
})
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
})
const Mutation = {
  ...auth,

  async createPost(parent, args, { request, prisma }, info) {
    if (!request.userId) throw new Error('No user found')
    const { error } = Joi.validate({ ...args }, createPostSchema, { abortEarly: false })
    if (error) {
      const errors = {}
      error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')))
      throw new Error(JSON.stringify(errors))
    }
    const post = await prisma.createPost({
      ...args,
      costs: { create: [...args.costs] },
      author: { connect: { id: request.userId } }
    })
    return post
  },

  async deletePost(parent, args, { request, prisma }, info) {
    if (!request.userId) {
      throw new Error('No user found')
    }
    const user = await prisma.post({ id: args.postId }).author()
    if (user.id === request.userId) {
      const post = await prisma.deletePost({ id: args.postId })
      return post
    } else {
      throw new Error('No posts found')
    }
  },
  async updatePost(parent, args, { prisma, request }, info) {
    if (!request.userId) {
      throw new Error('No user found')
    }
    const { error } = Joi.validate({ ...args }, updatePostSchema, { abortEarly: false })
    if (error) {
      const errors = {}
      error.details.map(err => (errors[err.path[0]] = err.message.replace(/"/g, '')))
      throw new Error(JSON.stringify(errors))
    }
    const user = await prisma.post({ id: args.postId }).author()
    if (user.id === request.userId) {
      if (args.costs) {
        const costs = await prisma.deleteManyCostCalculates({ id_gt: 'a' })
        const post = await prisma.updatePost({
          where: { id: args.postId },
          data: {
            title: args.title,
            description: args.description,
            costs: {
              create: [...args.costs]
            }
          }
        })
        return post
      }
      const post = await prisma.updatePost({
        where: { id: args.postId },
        data: {
          title: args.title,
          description: args.description
        }
      })
      return post
    } else {
      throw new Error('No posts found')
    }
  }
}

module.exports = Mutation
