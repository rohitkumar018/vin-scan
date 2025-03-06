import { Request, Response } from 'express';

export const handleMessage = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // For now, we'll just echo back a simple response
    // In a real application, you might want to integrate with a chat service or AI
    const response = `Server received: ${message}`;

    res.json({ message: response });
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}; 