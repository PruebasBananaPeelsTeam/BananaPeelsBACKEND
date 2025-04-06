import { join } from 'node:path';
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import routes from './routes/loginRoutes.js';

// import upload from './lib/uploadConfig.js';
import connectMongoose from './lib/mongooseConfig.js';

await connectMongoose();
console.log('✅ MongoDB connected!');

const app = express();

// middlewares

// morgan logger for http requests logs
app.use(logger('dev'));
// transforms json objects into js objects
app.use(express.json());
// transforms data sent by a form to a js object
app.use(express.urlencoded({ extended: true }));
// cookie parser to get cookies from client
app.use(cookieParser());
// set the folder where statis resources will be served
app.use(express.static(join(import.meta.dirname, 'public')));

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
