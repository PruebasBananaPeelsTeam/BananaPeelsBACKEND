import rateLimit from 'express-rate-limit';

export const registerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 3, // 3 registros por IP por minuto
    message: {
        error: true,
        message: 'Too many accounts created, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
