import express from 'express';
import { createUser } from '../controllers/registerController.js';

const router = express.Router();

router.post('/api/register', createUser);

export default router;
