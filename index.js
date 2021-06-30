import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './data/schema';
import { resolvers } from './data/resolvers';
import conectarDB from './data/conexionDB';
const app = express();

conectarDB();

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({app});

app.listen({ port: process.env.PORT }, () => console.log(`El servidor esta corriendo`));