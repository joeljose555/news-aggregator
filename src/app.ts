import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectDb } from './db/initDb';
import { startNewsFetchScheduler } from './schedulers/newsFetchScheduler';
import rssUrlRoutes from './routes/rssUrlRoutes';

async function startServer() {
  try {
    // Connect to database first
    await connectDb();
    
    const app = express();
    app.use(express.json());
    app.use('/api/rssUrl', rssUrlRoutes);

    app.listen(process.env.PORT, async () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      // Start the news fetch scheduler after server is running
      await startNewsFetchScheduler();
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

startServer();