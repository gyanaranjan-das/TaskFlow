import AppError from '../utils/AppError.js';

/**
 * Zod validation middleware factory
 * Creates middleware that validates req.body against a Zod schema
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'query'|'params'} source - Request property to validate
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const messages = result.error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      );
      throw new AppError(messages.join('. '), 400);
    }

    // Replace with parsed data (includes defaults / transforms)
    req[source] = result.data;
    next();
  };
};

export default validate;
