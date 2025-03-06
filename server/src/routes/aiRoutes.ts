import express from 'express';
import { searchWeb, chatWithAI } from '../controllers/aiController';
import { OpenRouterService } from '../services/openRouter.service';

const router = express.Router();

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    const openRouter = OpenRouterService.getInstance();
    const result = await openRouter.chat([
      { role: 'user', content: 'Say hello!' }
    ]);
    res.json({ result });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: String(error) });
  }
});

router.post('/search', searchWeb);
router.post('/chat', chatWithAI);

export default router; 