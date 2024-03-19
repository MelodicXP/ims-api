'use strict';

// 3rd party resources
const express = require('express');
// ** use this later - const cors = require('cors');

// Esoteric resources
const PORT = process.env.PORT || 3000;

// Prepare express app
const app = express();

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
};