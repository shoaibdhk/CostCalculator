const { prisma } = require('../../prisma/generated/prisma-client')

const Query = {
  async me(parent, args, { request, prisma }, info) {
    if (request.userId) {
      const ME_QUERY = /* GraphQL */ `
        query ME_QUERY($id: ID!) {
          user(where: { id: $id }) {
            id
            name
            email
            posts {
              id
              title
              description
              costs {
                id
                title
                price
              }
              createdAt
            }
          }
        }
      `
      const variables = { id: request.userId }
      const user = await prisma.$graphql(ME_QUERY, variables)
      return user.user
    }
  },
  async posts(parent, args, { request, prisma }, info) {
    if (!request.userId) {
      throw new Error('No user found')
    }
    const posts = await prisma
      .user({ id: request.userId })
      .posts({ orderBy: 'createdAt_DESC' })
      .$fragment(`{id title description costs{id title price} createdAt}`)
    return posts
  },
  async post(parent, args, { request }, info) {
    return await prisma
      .post({ id: args.id })
      .$fragment(`{id title description costs{id title price} createdAt}`)
  }
}
module.exports = Query
