class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4')
      ? 'fail'
      : 'error';
    this.isOperationError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
