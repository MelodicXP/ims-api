'use strict';

/*
  In this example, we directly export an anonymous function

  NOTE: this one has 4 parameters, which means Express knows intrinsically that it is for handling server errors

  Because we'll be building out an API that works with JSON, let's format
  our response as a JSON object
*/

module.exports = function (err, req, res, next) {

  // Check if the error object has a status code set; otherwise, default to 500
  const statusCode = err.status || 500;

  // Sometimes, errors come in as an object, others as a string
  const errorMessage = err.message ? err.message : err;

  const errorObject = {
    status: statusCode,
    message: errorMessage,
  };
  res.status(statusCode).json(errorObject);
};
