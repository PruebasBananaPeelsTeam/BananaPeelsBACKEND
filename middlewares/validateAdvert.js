import { body, validationResult } from "express-validator";

export const validateAdvert = [
    body('name')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100}).withMessage('El nombre no puede tener más de 100 caracteres'),

    body('description')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),
    
    body('price')
        .notEmpty().withMessage('El precio es obligatorio')
        .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    
    body('type')
        .notEmpty().withMessage('El tipo es obligatorio')
        .isIn(['buy', 'sell']).withMessage('El tipo debe ser "buy" o "sell"'),
    
    body('tags')
        .isArray({ min: 1 }).withMessage('Al menos un tag es obligatorio'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }
        next()

    }
]