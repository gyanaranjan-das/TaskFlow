/**
 * Paginate a Mongoose query
 * @param {import('mongoose').Query} query - Mongoose query
 * @param {Object} options
 * @param {number} [options.page=1] - Current page
 * @param {number} [options.limit=10] - Items per page
 * @param {import('mongoose').Model} model - Mongoose model for count
 * @param {Object} [filter={}] - Filter object for count query
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
const paginate = async (query, { page = 1, limit = 10 }, model, filter = {}) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    query.skip(skip).limit(limitNum),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      hasMore: pageNum * limitNum < total,
    },
  };
};

export default paginate;
