import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import express from "express";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

morgan.token("graphql-query", (req) => {
  const { query, variables, operationName } = req.body;
  if (!operationName)
    return `GRAPHQL: \nOperation Name: ${operationName} \nQuery: ${query}`;
});

const app = express();
const prisma = new PrismaClient({ log: ["query", "info", "warn"] });
app.use(express.json());
app.use(morgan(":graphql-query"));

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.ts"],
  });

  const server = new ApolloServer({
    schema,
    context: (...req) => ({ ...req, prisma }),
  });
  // middleware
  server.applyMiddleware({ path: "/", app });

  let port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log("server is running on http://localhost:" + port);
  });
}

/**
 * Ready?? bootstrap now :)
 */
bootstrap();
