import express from 'express';
import { handleMessage } from '../controllers/chatController';

const router = express.Router();

router.post('/send', handleMessage);

export default router; 