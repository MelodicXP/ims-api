'use strict';

const bcrypt = require('bcrypt');

/**
 * Hashes a user's password.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

module.exports = {
  hashedPassword: hashPassword,
};
