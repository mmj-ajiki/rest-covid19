'use strict';
/*
 * [FILE] app.js
 * 
 * [DESCRIPTION]
 *  JavaScript file for the sample REST server with authentication
 * 
 * [NOTE]
 *  This file is called from server.js.
 * 
 *  Settings to the external data connection in GEMBA Note (default settings):
 *   Auth Endpoint:   http://localhost:5000/auth
 *   Token Endpoint:  http://localhost:5000/token
 *   Client ID:       gemba
 *   Redirect URI:    http://localhost:5000/callback
 */ 
import createError from 'http-errors';
import express from 'express';
import favicon from 'serve-favicon';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { nanoid } from 'nanoid';
import * as jose from 'jose';
import crypto from 'crypto';
import * as fs from "node:fs/promises";
import { generateCodeChallenge, generateCodeVerifier } from './api/util.js';
import dotenv from 'dotenv'
dotenv.config();
import url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;
if (devMode) {
  console.log("Starting the app as the development mode");
}

// Environment variables
const clientID = process.env.CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;
const privateKeyFile = process.env.PRIVATE_KEY_FILE;

let app = express();

import restRouter from './routes/rest.js';
import topRouter  from './routes/top.js';

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

const clients = new Map();   // { clientId: redirectUri }
const users = new Map();     // { username: password }
const authCodes = new Map(); // { authCode: { code_challenge, code_challenge_method, client_id, redirect_uri, code_verifier } }
clients.set(clientID, redirectUri);

// Temporary user and the password - Change here for your system
users.set('user', 'pass');

app.get('/', 
  function(req, res) {
    res.redirect('/top');
});
app.use('/rest',  restRouter); 
app.use('/top',  topRouter); 

/*
 * GET Method
 * End Point: /auth
 * 
 * [DESCRIPTION]
 *  Construct a Sign-in page for authentication from an external app
 *
 * [INPUTS]
 *  response_type, client_id, redirect_uri, state, code_challenge, code_challenge_method
 * 
 * [OUTPUTS]
 *  Open the login page for inquiring a user name and password
 * 
 * [NOTE]
 *  This method is called by any other external app (therefore, code_verifier is missing)
 */
app.get('/auth', function(req, res) {
  const { response_type, client_id, redirect_uri, state, code_challenge, code_challenge_method } = req.query;

  if (!clients.has(client_id) || clients.get(client_id) !== redirect_uri) {
    return res.render('error', { title: 'Bad Request', status: 400, message: 'Invalid client' });
  }

  return res.render('login', { title: 'COVID-19 REST Server Sign-in', 
      client_id, redirect_uri, state, code_challenge, code_challenge_method, code_verifier: null });
});
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

/*
 * GET Method
 * End Point: /auth_local
 * 
 * [DESCRIPTION]
 *  Construct a Sign-in page for authentication from this web service
 *
 * [INPUTS] None
 * 
 * [OUTPUTS]
 *  Open the login page for inquiring a user name and password
 * 
 * [NOTE]
 *  This method is called inside this web service
 */
app.get('/auth_local', function(req, res) {

  const state = nanoid();
  const code_verifier = generateCodeVerifier();
  const code_challenge = generateCodeChallenge(code_verifier);
  const code_challenge_method = 'S256';

  return res.render('login', { title: 'COVID-19 REST Server Sign-in', 
      client_id: clientID, redirect_uri: redirectUri, state, code_challenge, code_challenge_method, code_verifier });
});
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

/*
 * GET Method
 * End Point: /callback
 * 
 * [DESCRIPTION]
 *  Redirect function - this is called inside this web service to generate an access token
 *
 * [INPUTS]
 *  code - Generated code string
 * 
 * [OUTPUTS]
 *  Open the top page
 * 
 * [NOTE]
 *  The 'available' key is used to show the Get Token button.
 */
app.get('/callback', function(req, res) {
  const { code } = req.query;
  const storedData = authCodes.get(code);

  return res.render('top', { title: 'COVID-19 REST Server', available: 1,
      grant_type: 'authorization_code', code, redirect_uri: storedData.redirect_uri, 
      client_id: storedData.client_id, code_verifier: storedData.code_verifier
  });
});
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

/*
 * GET Method
 * End Point: /login
 * 
 * [DESCRIPTION]
 *  Button action of the /authorize endpoint to test if input user is valid
 *
 * [INPUTS]
 *  client_id, redirect_uri, state, code_challenge, code_challenge_method, code_verifier, username, password
 * 
 * [OUTPUTS]
 *  Redirect to the callback method
 */
app.post('/login', async function(req, res) {
  const { client_id, redirect_uri, state, code_challenge, code_challenge_method, code_verifier, username, password } = await req.body;

  if (!users.has(username) || users.get(username) !== password) {
    return res.render('error', { title: 'Unauthorized', status: 401, message: 'Invalid credentials' });
  }

  const code = nanoid();
  authCodes.set(code, { code_challenge, code_challenge_method, client_id, redirect_uri, code_verifier });

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', code);
  if (state && state !== 'undefined') {
    redirectUrl.searchParams.set('state', state);
  }

  return res.redirect(redirectUrl.toString());
});
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

/*
 * GET Method
 * End Point: /token
 * 
 * [DESCRIPTION]
 *  Generate an access token using JWT (JSON Web Token)
 *
 * [INPUTS]
 *  grant_type, code, redirect_uri, client_id, code_verifier
 * 
 * [OUTPUTS]
 *  { access_token: <Access Token>, token_type: 'Bearer' }
 */
app.post('/token', async function(req, res) {
  const { grant_type, code, redirect_uri, client_id, code_verifier } = await req.body;

  if (grant_type !== 'authorization_code') {
    return res.render('error', { title: 'Bad Request', status: 400, message: 'Unsupported grant type' });
  }

  const storedData = authCodes.get(code);
  if (!storedData || storedData.client_id !== client_id || storedData.redirect_uri !== redirect_uri) {
    return res.render('error', { title: 'Bad Request', status: 400, message: 'Invalid code' });
  }

  // Verify PKCE
  const expectedHash = crypto.createHash('sha256').update(code_verifier).digest('base64url');
  if (expectedHash !== storedData.code_challenge) {
    return res.render('error', { title: 'Bad Request', status: 400, message: 'Invalid code verifier' });
  }

  let jwt;
  try {
    // Read the private key from a file
    const textPrivate = await fs.readFile(privateKeyFile, "utf-8");
    const privateKey = await jose.importPKCS8(textPrivate, 'RS256');
    jwt = await new jose.SignJWT({ 'urn:example:claim': true })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setIssuer('urn:example:issuer')
      .setAudience(client_id)
      .setExpirationTime('2h') // Lifetime
      .sign(privateKey);

    if (devMode) console.log("[TOKEN]", jwt);
  } catch (error) {
    return res.render('error', { title: 'Forbidden', status: 403, message: 'Invalid code verifier' });
  }

  return res.json({ access_token: jwt, token_type: 'Bearer' });
});
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

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
 * FILE HISTORY
 * [2] JUN-06-2024 - Added authentication
 * [1] MAY-29-2024 - Initial version
 */