import logger from '../utils/logger.js';

/**
 * Global error handler middleware
 * Handles all operational and programming errors
 * Must be the LAST middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error(`${err.message}`, { stack: err.stack, url: req.originalUrl, method: req.method });

  // Mongoose ValidationError (400)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error.message = messages.join('. ');
    error.statusCode = 400;
  }

  // Mongoose CastError - invalid ObjectId (400)
  if (err.name === 'CastError') {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // Mongoose duplicate key error (409)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `Duplicate value for "${field}". This ${field} is already taken.`;
    error.statusCode = 409;
  }

  // JWT errors (401)
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired. Please refresh your session.';
    error.statusCode = 401;
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.message = 'File too large. Maximum size is 5MB.';
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
