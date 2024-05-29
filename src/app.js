'use strict';
/*
 * [FILE] app.js
 * 
 * [DESCRIPTION]
 *  JavaScript file for the sample REST server
 * 
 * [NOTE]
 *  This file is used in server.js.
 */ 
import createError from 'http-errors';
import express from 'express';
import favicon from 'serve-favicon';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv'
// Added for ESM
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;
if (devMode) {
  console.log("Starting the app as the development mode");
}

let app = express();

import indexRouter  from './routes/index.js';
import restRouter   from './routes/rest.js';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
if (devMode) app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.get('/', 
  function(req, res) {
    res.redirect('/index');
});
app.use('/index', indexRouter);
app.use('/rest',  restRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'ERROR'});
});

export default app;

/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */