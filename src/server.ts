import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import express from 'express'

const app = express()

async function bootstrap() {
	const schema = await buildSchema({
		resolvers: [__dirname + '/modules/**/*.resolver.ts'],
		authChecker: () => {
			return true
		}
	})

	const server = new ApolloServer({
		schema,
		context: ({ req }) => ({ req })
	})
	// middleware
	server.applyMiddleware({ path: '/', app })

	let port = process.env.PORT || 5000
	app.listen(port, () => {
		console.log('http://localhost:' + port)
	})
}

/**
 * Ready?? bootstrap now :)
 */
bootstrap()
