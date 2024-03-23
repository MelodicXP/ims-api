'use strict';

const jwt = require ('jsonwebtoken');
const { SECRET } = require('../../utilities/secret-config');

const generateToken = (payload) => jwt.sign(payload, SECRET);

const getCapabilities = (role) => {
  const accessControlList = {
    clerk: ['create', 'read', 'update'],
    manager: ['create', 'read', 'update', 'delete'],
    auditor: ['read'],
  };
  return accessControlList[role] || [];
};

module.exports = (DataTypes) => ({
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
    type: DataTypes.ENUM('clerk', 'manager', 'auditor'),
    required: true,
    defaultValue: 'clerk',
  },
  token: {
    type: DataTypes.VIRTUAL,
    get() {
      return generateToken({ username: this.username });
    },
    set(tokenObj) {
      return generateToken(tokenObj);
    },
  },
  capabilities: {
    type: DataTypes.VIRTUAL,
    get() {
      return getCapabilities(this.role);
    },
  },
});