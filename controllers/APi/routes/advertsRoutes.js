import express from 'express';
import { createAdvert } from '../../advertsController';
import { authMiddleware } from '../../../middlewares/auth';

const router = express.Router();

router.post('/', authMiddleware, createAdvert);

export default router;