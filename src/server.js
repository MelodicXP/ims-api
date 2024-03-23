'use strict';

// 3rd party resources
const express = require('express');
const cors = require('cors');

// Esoteric resources
const PORT = process.env.PORT || 3000;
const notFoundHandler = require('../src/error-handlers/404');
const errorHandler = require('../src/error-handlers/500');
const authRouter = require('./routes/user-auth-router');

// Prepare express app
const app = express();

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRouter);

// Establish default route
app.get('/', (req, res, next) => {
  const message = 'Default route message';
  res.status(200).json({ message });
});

// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

// Start server
function startServer() {
  if(!PORT) {
    throw new Error('Missing Port');
  }
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}

module.exports = {
  startServer,
  app,
};