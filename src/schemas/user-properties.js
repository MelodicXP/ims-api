'use strict';

const { DataTypes } = require('sequelize');
const jwt = require ('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = {
  username: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  role: {
    type: DataTypes.ENUM('clerk, manager, auditor'),
    required: true,
  },
  token: {
    type: DataTypes.VIRTUAL,
    get() {
      return jwt.sign({ username: this.username }, SECRET);
    },
    set(tokenObj) {
      let token = jwt.sign(tokenObj, SECRET);
      return token;
    },
  },
  capabilities: {
    type: DataTypes.VIRTUAL,
    get() {
      const accessControlList = {
        clerk: ['create', 'update'],
        manager: ['read', 'create', 'update', 'delete'],
        auditor: ['read'],
      };
      return accessControlList[this.role];
    },
  },
};