import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDb } from './db/initDb';
import { startNewsFetchScheduler } from './schedulers/newsFetchScheduler';
import rssUrlRoutes from './routes/rssUrlRoutes';
import aiSummarizerRoutes from './routes/aiSummarizerRoutes';
import { morganMiddleware, logInfo, logError, logSuccess } from './utils/logger';

async function startServer() {
  try {
    // Connect to database first
    await connectDb();
    logSuccess('Database connected successfully');
    
    const app = express();
    
    // Add Morgan middleware for HTTP request logging
    app.use(morganMiddleware);
    
    app.use(express.json());
    app.use('/api/rssUrl', rssUrlRoutes);
    app.use('/api/ai-summarizer', aiSummarizerRoutes);

    app.listen(process.env.PORT, async () => {
      logSuccess(`🚀 Server is running on port ${process.env.PORT}`);
      logInfo('📡 Starting news fetch scheduler...');
      
      // Start the news fetch scheduler after server is running
      await startNewsFetchScheduler();
      logSuccess('✅ News fetch scheduler started successfully');
    });
  } catch (error) {
    logError('❌ Error starting the server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logError('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logError('💥 Unhandled Rejection at:', reason, { promise });
  process.exit(1);
});

startServer();