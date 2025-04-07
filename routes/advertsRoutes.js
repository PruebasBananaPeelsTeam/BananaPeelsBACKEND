import express, { Router } from 'express';
import { advertsList } from '../controllers/advertsListController.js'

//Definicion de rutas

const router = express.Router();

//GET /api/adverts

router.get('/api/adverts', advertsList);
import express from 'express';
import { createAdvert } from '../controllers/create_advertsController.js';
//import { authMiddleware } from '../middlewares/auth.js';
import upload from '../lib/uploadConfig.js';


router.post('/api/adverts', /*authMiddleware,*/ upload.single('image'), createAdvert);

export default router;
