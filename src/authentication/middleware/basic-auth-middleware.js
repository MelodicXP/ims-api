'use strict';

const base64 = require('base-64');
const models = require('../../database/database-models');
const { User } = models;

function extractCredentialsFromHeader (authHeader) {
  const encodedCredentials = authHeader.split(' ').pop();
  const decodedCredentials = base64.decode(encodedCredentials);
  const [username, password] = decodedCredentials.split(':');
  return { username, password };
}

function sendAuthenticationErrorResponse(res) {
  res.status(403).json({ message: 'Invalid Login'});
}

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic')) {
    return sendAuthenticationErrorResponse(res);
  }
  
  try {
    const { username, password } = extractCredentialsFromHeader(authHeader);
    req.user = await User.authenticateUserBasic(username, password);
    next();
  } catch (error) {
    console.error(error);
    sendAuthenticationErrorResponse(res);
  }
};