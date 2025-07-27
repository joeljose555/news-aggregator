import { Router } from 'express';
import { getRssUrlsController, insertRssUrlsController, updateCategoriesWithImagesController } from '../controller/rssUrlController';

const router = Router();

router.get('/getRssUrls', getRssUrlsController);
router.post('/insertRssUrls', insertRssUrlsController);
router.put('/updateCategoriesWithImages', updateCategoriesWithImagesController);

export default router;