'use strict';

const base64 = require('base-64');
const models = require('../../schemas/models-and-collections');
const { users } = models;

function decodeBasicAuthHeader (authHeader) {
  const encodedString = authHeader.split(' ').pop;
  const decodedString = base64.decode(encodedString);
  const [username, password] = decodedString.split(':');
  return { username, password };
}

function authenticationErrorResponse(res) {
  res.status(403).json({ message: 'Invalid Login'});
}

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Basic')) {
    return authenticationErrorResponse(res);
  }
  
  try {
    const { username, password } = decodeBasicAuthHeader(header);
    req.user = await users.authenticateBasic(username, password);
    next();
  } catch (error) {
    console.error(error);
    authenticationErrorResponse(res);
  }
};