import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import initCronJobs from './utils/cronJobs.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import projectRoutes from './routes/project.routes.js';
import userRoutes from './routes/user.routes.js';
import labelRoutes from './routes/label.routes.js';
import commentRoutes from './routes/comment.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ═══ Security Middleware ═══
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(globalLimiter);

// ═══ Logging ═══
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// ═══ Health Check ═══
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ═══ API Routes ═══
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/comments', commentRoutes);

// ═══ 404 Handler ═══
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ═══ Global Error Handler (must be last) ═══
app.use(errorHandler);

// ═══ Start Server ═══
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Configure Cloudinary
    configureCloudinary();

    // Initialize cron jobs
    initCronJobs();

    app.listen(PORT, () => {
      logger.info(`🚀 TaskFlow server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

export default app;
