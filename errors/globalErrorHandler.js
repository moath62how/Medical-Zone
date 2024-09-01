//TODO Make this error handling function and more for error handling
exports.globalErrorHandler = (err, req, res, next) => {
  console.log(err);

  res
    .status(err.statusCode || 500)
    .send({ status: err.status, message: err.message });
  next();
};
