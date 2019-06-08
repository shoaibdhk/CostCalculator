const { prisma } = require('./../prisma/generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const resolvers = {
  Query,
  Mutation
}

const server = new GraphQLServer({
  typeDefs: __dirname + '/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  context: req => ({ prisma, ...req })
})

module.exports = server
