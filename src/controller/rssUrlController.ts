import { Request, Response } from 'express';
import { getRssUrls, insertRssUrls } from '../services/rssURlService';
import { logInfo, logError, logDb } from '../utils/logger';

const getRssUrlsController = async (req: Request, res: Response) => {
    try {
        logInfo('📋 Fetching RSS URLs', { method: req.method, url: req.url });
        const rssUrls = await getRssUrls();
        if (rssUrls) {
            logDb('read', 'rssUrls', { count: rssUrls.length });
            res.status(200).json(rssUrls);
        } else {
            res.status(404).json({ message: 'No RSS URLs found' });
        }
    } catch (error) {
        logError('❌ Error fetching RSS URLs:', error, { method: req.method, url: req.url });
        res.status(500).json({ message: 'Error fetching RSS URLs' });
    }
}

const insertRssUrlsController = async (req: Request, res: Response) => {
    try {
        logInfo('➕ Inserting RSS URLs', { method: req.method, url: req.url, body: req.body });
        const result = await insertRssUrls(req.body);
        if (result && result.status) {
            logDb('insert', 'rssUrls', { success: true });
            res.status(200).json(result);
        } else {
            logError('❌ Failed to insert RSS URLs:', result?.message);
            res.status(500).json(result);
        }
    } catch (error) {
        logError('❌ Error inserting RSS URLs:', error, { method: req.method, url: req.url, body: req.body });
        res.status(500).json({ message: 'Error inserting RSS URLs' });
    }
}

export { getRssUrlsController, insertRssUrlsController };