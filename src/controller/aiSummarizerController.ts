import { Request, Response } from 'express';
import NewsArticle from '../models/newsArticles';
import { logInfo, logError, logSuccess, logDb } from '../utils/logger';
import NewsSummaries from '../models/newsSummaries';
import axios from 'axios';


/**
 * Summarize multiple articles in batch
 */
export const summarizeArticlesBatch = async (req: Request, res: Response): Promise<any> => {
    try {
        const { limit = 10, category } = req.query;
        
        logInfo('🤖 Starting batch summarization', { limit, category });
        

        
        // Find articles without summaries
        const articles = await NewsArticle.find({})
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .select('title fullText');
        
        if (articles.length === 0) {
            return res.status(200).json({ 
                message: 'No articles found without summaries',
                processed: 0 
            });
        }
        
        logInfo(`📄 Found ${articles.length} articles to summarize`);
        
        // Prepare articles for batch processing
        const articlesForBatch = articles.map(article => ({
            id: article._id.toString(),
            title: article.title,
            content: article.fullText || ''
        }));
        // Process batch summarization
        const {data} = await axios.post(
            `${process.env.HF_BASEURL}/summarize`,
            articlesForBatch,
            // { timeout: 60000 }
        );
        await NewsSummaries.create({
            summary: data.summary,
        });
        
        res.status(200).json({
            message: 'Batch summarization completed',
            total: articles.length,
            results: data.summary
        });
        
    } catch (error) {
        logError('❌ Error in summarizeArticlesBatch:', error);
        res.status(500).json({ message: 'Error in batch summarization' });
    }
};

export const generateAudio = async (req: Request, res: Response): Promise<any> => {
    try {
        const summaries = await NewsSummaries.find({}).sort({ createdAt: -1 }).limit(1);
        console.log(summaries[0]);
        const { data } = await axios.post(
            `${process.env.HF_BASEURL}/tts`,
            summaries[0],
            // { timeout: 60000 }
        );
            res.status(200).json({ message: 'Audio generated successfully', data });
    } catch (error) {
        console.log(error);
        logError('❌ Error in generateAudio:', error);
        res.status(500).json({ message: 'Error in generateAudio' });
    }
};