import { Router } from 'express';
import { getRssUrlsController, insertRssUrlsController } from '../controller/rssUrlController';

const router = Router();

router.get('/getRssUrls', getRssUrlsController);
router.post('/insertRssUrls', insertRssUrlsController);

export default router;