import express from 'express';
import { createAdvert } from '../controllers/create_advertsController.js';
//import { authMiddleware } from '../middlewares/auth.js';
import upload from '../lib/uploadConfig.js';

const router = express.Router();

router.post('/', /*authMiddleware,*/ upload.single('image'), createAdvert);

export default router;
