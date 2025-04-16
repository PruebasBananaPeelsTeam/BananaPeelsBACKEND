import { join } from 'node:path';
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes/Routes.js';
import connectMongoose from './lib/mongooseConfig.js';
import cors from 'cors';

await connectMongoose();
console.log('✅ MongoDB connected!');

const app = express();

// middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(import.meta.dirname, 'public')));
app.use('/images', express.static(join(import.meta.dirname, 'public/images')));

// Routing
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler para APIs (devolvemos JSON en vez de renderizar)
app.use(function (err, req, res, next) {
    console.error('❌ Error:', err.message);

    res.status(err.status || 500).json({
        error: true,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

export default app;
