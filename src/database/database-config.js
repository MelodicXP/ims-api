'use strict';

// 3rd party resources
const { Sequelize } = require('sequelize');

// Connect to database for testing purposes, OR connect to database from env
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite:memory'
  : process.env.DATABASE_URL;

// Configure database with dialect options
const DATABASE_CONFIGURATION = process.env.NODE_ENV === 'production' ? {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
} : {};

// Initialize single instance of Sequelize with databae configuration
const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIGURATION);

module.exports = {
  database: sequelize,
};