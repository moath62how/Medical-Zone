//TODO Make this error handling function and more for error handling
exports.globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  const APIError = req.originalUrl.startsWith('/api')
  if(APIError){
  res
    .status(err.statusCode || 500)
    .send({ status: err.status, message: err.message });
  }
  else {
    res.render("error", { status: err.status, message: err.message })
  }
  next();
};
