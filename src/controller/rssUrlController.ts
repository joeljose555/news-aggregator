import { Request, Response } from 'express';
import { getRssUrls, insertRssUrls } from '../services/rssURlService';
const getRssUrlsController = async (req: Request, res: Response) => {
    try {
        const rssUrls = await getRssUrls();
        return res.status(200).json(rssUrls);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching RSS URLs' });
    }
}

const insertRssUrlsController = async (req: Request, res: Response) => {
    try {
        const rssUrls = await insertRssUrls(req.body);
        return res.status(200).json(rssUrls);
    } catch (error) {
        return res.status(500).json({ message: 'Error inserting RSS URLs' });
    }
}

export { getRssUrlsController, insertRssUrlsController };