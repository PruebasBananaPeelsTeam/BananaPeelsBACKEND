import rateLimit from 'express-rate-limit';

export const advertLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message:
            ' Has alcanzado el límite de peticiones. Por favor, espera un momento antes de volver a intentarlo.',
    },
});
