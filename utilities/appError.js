module.exports = class AppError extends Error {
  constructor(name, httpCode, description, isOperational) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode || 500;
    this.description = description;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
};
