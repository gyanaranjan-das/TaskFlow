import { CronJob } from 'cron';
import Task from '../models/Task.js';
import RefreshToken from '../models/RefreshToken.js';
import sendEmail from './sendEmail.js';
import logger from './logger.js';

/**
 * Initialize cron jobs
 * - Due date reminders: daily at 8 AM (DISABLED)
 * - Expired token cleanup: daily at midnight
 * - Auto-close overdue: daily at 1 AM
 */
const initCronJobs = () => {
  // Auto-close overdue tasks - runs daily at 1:00 AM
  const autoCloseOverdue = new CronJob('0 1 * * *', async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const result = await Task.updateMany(
        {
          dueDate: { $lt: today, $ne: null },
          status: { $nin: ['done', 'cancelled'] },
          deletedAt: null,
        },
        { $set: { status: 'cancelled' } }
      );

      if (result.modifiedCount > 0) {
        logger.info(`🔒 Auto-closed ${result.modifiedCount} overdue tasks`);
      }
    } catch (error) {
      logger.error(`Cron (auto close overdue) failed: ${error.message}`);
    }
  });

  // Cleanup expired refresh tokens - runs daily at midnight
  const tokenCleanup = new CronJob('0 0 * * *', async () => {
    try {
      const result = await RefreshToken.deleteMany({
        expiresAt: { $lt: new Date() },
      });
      logger.info(`🧹 Cleaned up ${result.deletedCount} expired refresh tokens`);
    } catch (error) {
      logger.error(`Cron (token cleanup) failed: ${error.message}`);
    }
  });

  // Note: dueDateReminder is disabled per user request
  autoCloseOverdue.start();
  tokenCleanup.start();

  logger.info('⏰ Cron jobs initialized');
};

export default initCronJobs;
