'use strict';

/*
 * [FILE] covid19_history.js
 *
 * [DESCRIPTION]
 *  This defines functions to get history data regarding COVID-19
 * 
 * [NOTE]
 */

import httpGet from '../api/http_get.js';
import dotenv from 'dotenv'
dotenv.config();
const restURL=process.env.REST_URL;
// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;

/*
 * [FUNCTION] formatDate()
 *
 * [DESCRIPTION]
 *  Convert a date format (M/D/YY) to the corresponding epoch date
 * 
 * [INPUTS]
 *  inputDate - Target date to be converted (M/D/YY)
 * 
 * [OUTPUTS]
 * 
 * [NOTE]
 */
function formatDate(inputDate) {
  // Parse the input date (assuming it's in M/D/YY format)
  let [month, day, year] = inputDate.split('/').map(Number);

  const outputDate = new Date(year + 2000, month-1, day).getTime() / 1000;

  return outputDate;
}
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * [FUNCTION] getHistoricalData()
 *
 * [DESCRIPTION]
 *  Get number of infected persons and number of deaths by specified days
 * 
 * [INPUTS]
 *  country  - Target couontry
 *  lastdays - Number of days from today to get history data, if this is 'all', collect all data
 * 
 * [OUTPUTS]
 *  {'status':'<ok or error>', 
 *   'historyList': [
 *     {date: <Date1>, num_cases: <Number of infected on that date>, num_deaths: <Number of deaths on that date>},
 *     {date: <Date2>, num_cases: <Number of infected on that date>, num_deaths: <Number of deaths on that date>},
 *     ...], 
 *   'message': '<Message>'}
 * 
 * [NOTE]
 *  This method accesses:
 *     https://disease.sh/v3/covid-19/historical/<Country>?lastdays=<num of days or all>
 *
 *  The date format is M/D/YY. It will be converted to YYYY-MM-DD.
 */
async function getHistoricalData(country, lastdays) {
  let retVal = {'status':'error', 'historyList': [], 'message': '[COVID-19] Country not found'};

  if (!country || country == '') {
    return retVal;
  }

  let url = restURL + "historical/" + country + "?lastdays=" + lastdays;
  if (devMode) console.log("[URL]", url);
  const result = await httpGet(url);

  if (result != null) {
    const cases  = country == 'all' ? result.cases  : result.timeline.cases;
    const deaths = country == 'all' ? result.deaths : result.timeline.deaths;
    let prev_c_value = -1;
    let prev_d_value = -1;
    for (let key in cases) {
      let element = {};
      let num_cases  = Number(cases[key]);
      let num_deaths = Number(deaths[key]);
      if (prev_c_value >= 0 && prev_d_value >= 0) {
        element['date'] = formatDate(key); // date as a key name
        element['num_cases'] = num_cases-prev_c_value;
        element['num_deaths'] = num_deaths-prev_d_value;
        retVal.historyList.push(element);
      }
    
      // Set the current values
      prev_c_value = num_cases;
      prev_d_value = num_deaths;
    }
    retVal.status = 'ok';
    retVal.message = null;
  } 

  return retVal;
}
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

export { getHistoricalData }

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */