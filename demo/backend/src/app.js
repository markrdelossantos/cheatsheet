import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

import fillData from "./fillData.js";

const devFormatError = error => ({
  message: error.message,
  locations: error.locations,
  stack: error.stack,
  path: error.path
});

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
  formatError: devFormatError

}));
app.listen(3000, () => console.log('Now browse to localhost:3000/graphql'));

fillData();