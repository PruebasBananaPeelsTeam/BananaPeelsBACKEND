import express from 'express';
import { createAdvert } from '../controllers/create_advertsController.js';
//import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', /*authMiddleware,*/ createAdvert);

export default router;
