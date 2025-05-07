import rateLimit from 'express-rate-limit';

export const advertLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: true,
        message:
            'You have reached the request limit. Please wait a moment before trying again.',
    },
});
