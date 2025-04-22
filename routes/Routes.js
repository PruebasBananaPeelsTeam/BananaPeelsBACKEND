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
import { myAdverts } from '../controllers/myAdvertsController.js';
import { toggleReservedAdvert } from '../controllers/advertController.js'

const router = express.Router();

router.get('/adverts', advertsList);
router.post(
    '/adverts',
    authMiddleware,
    advertLimiter,
    upload.single('image'),
    validateAdvert,
    createAdvert,
);
router.post('/register', registerLimiter, createUser);
router.post('/login', loginLimiter, login);

router.get('/adverts/:id/:slug?', getAdvertDetail); 

router.get('/myAdverts', authMiddleware, myAdverts);
router.patch('/:id/toggle-reserved', authMiddleware, toggleReservedAdvert)

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

router.get('/tags', (req, res) => {
    res.json({ results: aviableTags })
})
export default router;
