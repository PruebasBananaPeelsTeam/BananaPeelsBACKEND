import express from 'express';
import upload from '../lib/uploadConfig.js';
import { createUser } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import { advertsList } from '../controllers/advertsListController.js';
import { createAdvert } from '../controllers/create_advertsController.js';
import { loginLimiter } from '../middlewares/loginLimiter.js';
import { authMiddleware } from '../middlewares/auth.js';
import { registerLimiter } from '../middlewares/registerLimiter.js';
import { validateAdvert } from '../middlewares/validateAdvert.js';
import { advertLimiter } from '../middlewares/advertLimiter.js';
import { getAdvertDetail } from '../controllers/advertDetailController.js';
import { forgotPassword } from '../controllers/forgotPasswordController.js';
import { resetPassword } from '../controllers/resetPasswordController.js';

const router = express.Router();

router.get('/api/adverts', advertsList);
router.post(
    '/api/adverts',
    authMiddleware,
    advertLimiter,
    upload.single('image'),
    validateAdvert,
    createAdvert,
);
router.post('/api/register', registerLimiter, createUser);
router.post('/api/login', loginLimiter, login);

router.post('/api/auth/forgot-password', forgotPassword);
router.post('/api/auth/reset-password', resetPassword);

router.get('/api/adverts/:id/:slug?', getAdvertDetail); //El slug es para hacerlo SEO-friendly desde el front

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
