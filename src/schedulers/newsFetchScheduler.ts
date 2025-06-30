import cron from 'node-cron';
import { fetchAndSaveNews } from '../services/fetchNewsService';
import { logInfo, logSuccess, logError } from '../utils/logger';

/**
 * Scheduler to fetch news from RSS feeds every 30 minutes
 */
export async function startNewsFetchScheduler() {
  logInfo('🕐 Starting news fetch scheduler...');

  // Schedule the news fetch to run every 30 minutes
  const task = cron.schedule('*/30 * * * *', async () => {
    logInfo('📰 Scheduled news fetch started at:', { timestamp: new Date().toISOString() });
    
    try {
      await fetchAndSaveNews();
      logSuccess('✅ Scheduled news fetch completed successfully');
    } catch (error) {
      logError('❌ Scheduled news fetch failed:', error);
    }
  }, {
    timezone: 'UTC' // You can change this to your preferred timezone
  });
  
  logSuccess('✅ News fetch scheduler started - will run every 30 minutes');
  
  // Return the task so it can be stopped if needed
  return task;
}

/**
 * Stop the news fetch scheduler
 */
export function stopNewsFetchScheduler(task: any) {
  if (task) {
    task.stop();
    logInfo('🛑 News fetch scheduler stopped');
  }
}

// Export a function to start the scheduler immediately
export function initializeScheduler() {
  return startNewsFetchScheduler();
}
