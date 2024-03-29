'use strict';

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error('Hashing password failed:', error);
    throw new Error('Error hashing password');
  }
}

module.exports = {
  hashPassword,
};
