import express from 'express';
import upload from '../lib/uploadConfig.js';
import { createUser } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import { advertsList } from '../controllers/advertsListController.js';
import { createAdvert } from '../controllers/create_advertsController.js';
import { loginLimiter } from '../middlewares/loginLimiter.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/api/adverts', advertsList);
router.post(
    '/api/adverts',
    authMiddleware,
    upload.single('image'),
    createAdvert,
);
router.post('/api/register', createUser);
router.post('/api/login', loginLimiter, login);

const aviableTags = [
    'lifestyle',
    'motor',
    'work',
    'mobile',
    'computer',
    'home',
    'garden',
    'clothes',
    'sports',
];

router.get('/api/tags', (req, res) => {
    res.json({ results: aviableTags })
})
export default router;
