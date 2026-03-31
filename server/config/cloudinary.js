import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

/**
 * Configure Cloudinary SDK
 * Gracefully handles missing configuration
 */
const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn('⚠️  Cloudinary not configured. File uploads will be disabled.');
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  logger.info('☁️  Cloudinary configured');
  return true;
};

export { cloudinary, configureCloudinary };
export default cloudinary;
