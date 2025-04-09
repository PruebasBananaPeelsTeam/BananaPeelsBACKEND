import rateLimit from 'express-rate-limit';

// limit of 5 login attemps per min
export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        error: true,
        message: 'Too many login attempts, please try again in 60 seconds.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
