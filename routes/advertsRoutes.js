import express, { Router } from 'express';
import { advertsList } from '../controllers/advertsListController.js'

//Definicion de rutas

const router = express.Router();

//GET /api/adverts

router.get('/api/adverts', advertsList);

export default router;
