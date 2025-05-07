import rateLimit from 'express-rate-limit';

export const advertLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 horas
    max: 15, // máximo 15 anuncios por día
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message:
            ' Has alcanzado el límite de peticiones diarias', //esto es para limitar los bots
    },
});
