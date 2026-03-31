import multer from 'multer';
import AppError from '../utils/AppError.js';

/**
 * Multer configuration for file uploads
 * Uses memory storage (buffer) for streaming to Cloudinary
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images and common document types
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type ${file.mimetype} is not allowed.`, 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5, // max 5 files at once
  },
});

/**
 * Single file upload middleware
 */
export const uploadSingle = upload.single('file');

/**
 * Multiple file upload middleware
 */
export const uploadMultiple = upload.array('files', 5);

/**
 * Avatar upload middleware
 */
export const uploadAvatar = upload.single('avatar');
