import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './data/schema';
import { resolvers } from './data/resolvers';
import conectarDB from './data/conexionDB';
import jwt  from 'jsonwebtoken';

const app = express();

conectarDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token, process.env.SECRETO);
                console.log(usuario);
                return {
                    usuario
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    }
});

server.applyMiddleware({ app });

app.listen({  port: process.env.PORT || 4000 }, () => console.log(`El servidor esta corriendo`));