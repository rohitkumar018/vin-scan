import { Request, Response } from 'express';
import { OpenRouterService } from '../services/openRouter.service';

export const searchWeb = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const openRouter = OpenRouterService.getInstance();
    const result = await openRouter.searchWeb(query);
    
    res.json({ result });
  } catch (error) {
    console.error('Web search error:', error);
    res.status(500).json({ error: 'Error performing web search' });
  }
};

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    const openRouter = OpenRouterService.getInstance();
    const result = await openRouter.chat(messages);
    
    res.json({ result });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error in chat conversation' });
  }
}; 