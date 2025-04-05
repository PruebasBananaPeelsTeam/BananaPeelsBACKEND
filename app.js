import { join } from 'node:path';
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import advertsRoutes from './routes/advertsRoutes.js';

// import upload from './lib/uploadConfig.js';
import connectMongoose from './lib/mongooseConfig.js';

connectMongoose()
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1); // detiene la app si no hay conexión
  });

//API controllers example
//import * as apiController from './controllers/APi/apiController.js';
// Web Site controller example
//import * as webSiteController from './controllers/controller.js';

const app = express();

// middlewares

// morgan logger for http requests logs
app.use(logger('dev'));
// transforms json objects into js objects
app.use(express.json());
// transforms data sent by a form to a js object
app.use(express.urlencoded({ extended: false }));
// cookie parser to get cookies from client
app.use(cookieParser());
// set the folder where statis resources will be served
app.use(express.static(join(import.meta.dirname, 'public')));

// starts i18n, reads header 'accept lenguage' from the request and choose a lang file
// app.use(i18n.init)

// Routing
// index route rendering home.ejs
app.get('/', (req, res) => {
  res.render('home');
});

// API routes
app.use('/api/adverts', advertsRoutes);

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
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
