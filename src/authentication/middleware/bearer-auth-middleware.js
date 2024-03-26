'use strict';

const models = require('../../models/create-all-models');
const { User } = models;

function extractTokenFromHeader(authHeader) {
  const token = authHeader.split(' ').pop();
  return token;
}

function sendAuthenticationErrorResponse(res) {
  res.status(403).json({ message: 'Invalid Login'});
}

async function validateUserToken (token) {
  try {
    const user = await User.authenticateUserToken(token);
    if (!user) {
      throw new Error('Invalid Token');
    }
    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendAuthenticationErrorResponse(res);
  }

  try {
    const token = extractTokenFromHeader(authHeader);
    const user = await validateUserToken(token);
    req.user = user; // User token validated
    req.token = token; // Attach token to request
    next();

  } catch (error) {
    console.error(error);
    sendAuthenticationErrorResponse(res);
  }
};