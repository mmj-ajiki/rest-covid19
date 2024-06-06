'use strict';
/*
 * [FILE] top.js
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
 * End Point: /top
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
 *  The 'available' key is used to hide the Get Token button.
 * 
 */
router.get('/', function(req, res, next) {
  res.render('top', { title: 'COVID-19 REST Server', available: 0 });
});

export default router;

/*
 * FILE HISTORY
 * [1] JUN-06-2024 - Initial version
 */