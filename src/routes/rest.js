'use strict';
/*
 * [FILE] rest.js
 * 
 * [DESCRIPTION]
 *  REST Methods for serving functions of COVID-19
 * 
 * [NOTE]
 */ 
import express from 'express';
const router = express.Router();
import restSetHedersForCors from '../api/cors.js';
// Environment variables
import dotenv from 'dotenv';
dotenv.config();
// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;

import { getCountryInfo, getCountries } from '../functions/covid19.js';
import { getHistoricalData } from '../functions/covid19_history.js';

/*
 * GET Method
 * End Point: /rest/countries
 * 
 * [DESCRIPTION]
 *  Get a list of available country names
 *
 * [INPUTS]
 *  req - Request from the method
 * 
 * [OUTPUTS]
 *  res - Response to be returned
 * 
 * [NOTE]
 * 
 */ 
router.get('/countries', async function(req, res) {
    let results = {};
    results['keys'] = ['country', 'shortname'];

    let countries = await getCountries();

    results['records'] = countries.countryList;
    results['message'] = countries.message;

    if (devMode) console.log("[JSON]", results);
    restSetHedersForCors(res);
    res.json(results);
});
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * POST Method
 * End Point: /rest/country_info
 * 
 * [DESCRIPTION]
 *  Get numbers of persons that were related with COVID-19 in the specified country
 *
 * [INPUTS]
 *  req - Request from the method
 *  country - Target country name
 * 
 * [OUTPUTS]
 *  res - Response to be returned
 * 
 * [NOTE]
 * 
 */ 
router.post('/country_info', async function(req, res) {
    let results = {};
    results['keys'] = ['active', 'critical', 'recovered', 'cases', 'deaths', 'tests'];
    results['records'] = [];
    results['message'] = "[COVID-19] Country is not specified";

    const country = req.body.country;
    restSetHedersForCors(res);
    if (country == "" || country == undefined) { // Parameter not found
        res.json(results);
        return;
    }

    let cinfo = await getCountryInfo(country);
    results['records'] = cinfo.countryInfo;
    results['message'] = cinfo.message;

    if (devMode) console.log("[JSON]", results);
    res.json(results);
});
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * POST Method
 * End Point: /rest/history
 * 
 * [DESCRIPTION]
 *  Get number of infected persons, number of deaths for specified days
 *
 * [INPUTS]
 *  req - Request from the method
 *  country - Target country name
 *  num_of_days - Number of days to retrieve history data
 * 
 * [OUTPUTS]
 *  res - Response to be returned
 * 
 * [NOTE]
 *  Data sampling has been finshed since March 9, 2023. 
 *  Therefore this method returns historical data from that day.
 * 
 */ 
router.post('/history', async function(req, res) {
    let results = {};
    results['keys'] = ['date', 'num_cases', 'num_deaths'];
    results['records'] = [];
    results['message'] = "[COVID-19] Country is not specified";

    const country = req.body.country;
    restSetHedersForCors(res);
    if (country == "" || country == undefined) { // Parameter not found
        res.json(results);
        return;
    }

    let num_days = req.body.num_of_days;
    if (num_days == undefined) { // Parameter not found
        num_days = 30;
    }

    let hinfo = await getHistoricalData(country, num_days);
    results['records'] = hinfo.historyList;
    results['message'] = hinfo.message;

    if (devMode) console.log("[JSON]", results);
    res.json(results);
});
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * GET Method
 * End Point: /rest/test
 * 
 * [DESCRIPTION]
 *  Test if the rest service works
 *
 * [INPUTS]
 * 
 * [OUTPUTS]
 *  {
 *    "keys": ["apple", "orange", "banana"],
 *    "records": [{"apple": 1, "orange": 2,"banana": 3}, ...],
 *    "message": null
 *  }
 */
router.get('/test', async function(req, res) {
    let results = {};
    results['keys'] = ['apple', 'orange', 'banana'];
    let list = [];
    let elements = {'apple':1, 'orange':2, 'banana':3};
    list.push(elements);
    elements = {'apple':7, 'orange':5, 'banana':4};
    list.push(elements);
    elements = {'apple':11, 'orange':23, 'banana':31};
    list.push(elements);
    results['records'] = list;
    results['message'] = null;

    if (devMode) console.log("[JSON]", results);

    restSetHedersForCors(res);
    res.json(results);
});
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

export default router;

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */
