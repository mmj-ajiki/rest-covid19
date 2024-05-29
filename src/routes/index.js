'use strict';
/*
 * [FILE] index.js
 * 
 * [DESCRIPTION]
 *  Open the top page of the Sample REST Server
 * 
 * [NOTE]
 */ 
import express from 'express';
const router = express.Router();

/*
 * GET Method
 * End Point: /index
 * 
 * [DESCRIPTION]
 *  Open the top page
 * 
 * [INPUTS]
 *  req    - Request
 *  res    - Response
 * 
 * [OUTPUTS]
 *  JSON including keys: error
 * 
 * [NOTE]
 * 
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to COVID-19 REST Server' });
});

export default router;

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */