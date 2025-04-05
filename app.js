import { join } from 'node:path';
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import advertsRoutes from './routes/advertsRoutes.js';

// import upload from './lib/uploadConfig.js';
import connectMongoose from './lib/mongooseConfig.js';

//API controllers example
import * as apiController from './controllers/APi/apiController.js';
// Web Site controller example
import * as webSiteController from './controllers/controller.js';

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

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
