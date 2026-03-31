import { CronJob } from 'cron';
import Task from '../models/Task.js';
import RefreshToken from '../models/RefreshToken.js';
import sendEmail from './sendEmail.js';
import logger from './logger.js';

/**
 * Initialize cron jobs
 * - Due date reminders: daily at 8 AM
 * - Expired token cleanup: daily at midnight
 */
const initCronJobs = () => {
  // Due date reminder - runs daily at 8:00 AM
  const dueDateReminder = new CronJob('0 8 * * *', async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await Task.find({
        dueDate: { $gte: today, $lte: tomorrow },
        status: { $nin: ['done', 'cancelled'] },
        deletedAt: null,
      }).populate('creator assignees', 'name email');

      for (const task of tasks) {
        const recipients = [
          task.creator,
          ...task.assignees,
        ].filter(Boolean);

        const uniqueEmails = [...new Set(recipients.map((r) => r.email))];

        for (const email of uniqueEmails) {
          await sendEmail({
            to: email,
            subject: `⏰ Task Due Soon: ${task.title}`,
            html: `
              <h2>Task Due Reminder</h2>
              <p>The task "<strong>${task.title}</strong>" is due on 
              <strong>${task.dueDate.toLocaleDateString()}</strong>.</p>
              <p>Status: ${task.status}</p>
              <p>Priority: ${task.priority}</p>
            `,
          });
        }
      }

      logger.info(`📧 Due date reminders sent for ${tasks.length} tasks`);
    } catch (error) {
      logger.error(`Cron (due date reminder) failed: ${error.message}`);
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

  dueDateReminder.start();
  tokenCleanup.start();

  logger.info('⏰ Cron jobs initialized');
};

export default initCronJobs;
