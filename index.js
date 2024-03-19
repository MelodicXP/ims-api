'use strict';

require('dotenv').config();

const { startServer } = require('./src/server');

const { database } = require('./src/schemas/schemas-index');

async function initializeApp() {
  try {
    await database.sync();
    console.log('Successful Connection!');
    startServer();
  } catch (error) {
    console.error('Failed to start the application:', error);
  }
}

initializeApp();