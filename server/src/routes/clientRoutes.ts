import express from 'express';
import { createClient, getClient, updateClient } from '../controllers/clientController';

const router = express.Router();

router.post('/', createClient);
router.get('/:id', getClient);
router.put('/:id', updateClient);

export default router; 