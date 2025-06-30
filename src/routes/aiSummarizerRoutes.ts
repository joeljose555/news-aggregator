import { Router } from 'express';
import { 
    summarizeArticlesBatch, 
    generateAudio,
} from '../controller/aiSummarizerController';

const router = Router();

// Batch summarize articles
router.post('/summarize-batch', summarizeArticlesBatch);
router.post('/generate-audio', generateAudio);

export default router; 