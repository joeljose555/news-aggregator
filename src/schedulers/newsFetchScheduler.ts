import cron from 'node-cron';
import { fetchAndSaveNews } from '../services/fetchNewsService';

/**
 * Scheduler to fetch news from RSS feeds every 30 minutes
 */
export async function startNewsFetchScheduler() {
  console.log('🕐 Starting news fetch scheduler...');

  // Schedule the news fetch to run every 30 minutes
  const task = cron.schedule('*/30 * * * *', async () => {
    console.log('📰 Scheduled news fetch started at:', new Date().toISOString());
    
    try {
      await fetchAndSaveNews();
      console.log('✅ Scheduled news fetch completed successfully');
    } catch (error) {
      console.error('❌ Scheduled news fetch failed:', error);
    }
  }, {
    timezone: 'UTC' // You can change this to your preferred timezone
  });
  
  console.log('✅ News fetch scheduler started - will run every 30 minutes');
  
  // Return the task so it can be stopped if needed
  return task;
}

/**
 * Stop the news fetch scheduler
 */
export function stopNewsFetchScheduler(task: any) {
  if (task) {
    task.stop();
    console.log('🛑 News fetch scheduler stopped');
  }
}

// Export a function to start the scheduler immediately
export function initializeScheduler() {
  return startNewsFetchScheduler();
}
