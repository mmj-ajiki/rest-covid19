'use strict';

/*
 * [FILE] covid19.js
 *
 * [DESCRIPTION]
 *  This defines functions to get country information regarding COVID-19
 * 
 * [NOTE]
 * 
 */

import httpGet from '../api/http_get.js';
import dotenv from 'dotenv'
dotenv.config();
const restURL=process.env.REST_URL;
// Development mode
const devMode = process.env.NODE_ENV == 'development' ? true : false;

// ---------- Functions ----------

/*
 * [FUNCTION] getCountryInfo()
 *
 * [DESCRIPTION]
 *  指定した国の新型コロナウィルス感染状況をSlack向けブロック構造として整形する
 * 
 * [INPUTS]
 * 　country - Target country name
 * 
 * [OUTPUTS]
 *  成功: {blocks:[<見出し>, <セクション>]}
 *  失敗: {type:"error", text:"<Error message>"}
 * 
 * [NOTE]
 *  URL to be accessed:
 *   https://disease.sh/v3/covid-19/countries/<country>
 *   or if country is 'all'
 * 　https://disease.sh/v3/covid-19/all
 * 
 */
async function getCountryInfo(country) {
  let retVal = {'status':'error', 'countryInfo': [], 'message': '[COVID-19] Country not found'};

  let url = restURL + "countries/" + country;
  if (country == 'all') url = restURL + "all";
  if (devMode) console.log("[URL]", url);
  const result = await httpGet(url);

  if (result != null) {
    let info = {};
    info['active']    = Number(result.active);    // Number of infected persons
    info['critical']  = Number(result.critical);  // Number of seriously ill persons
    info['recovered'] = Number(result.recovered); // Discharge/end of treatment
    info['cases']     = Number(result.cases);     // Total number of infected persons
    info['deaths']    = Number(result.deaths);    // Total number of deaths
    info['tests']     = Number(result.tests);     // Number of tests
    retVal.countryInfo.push(info);
    retVal.status = 'ok';
    retVal.message = null;
  } 

  return (retVal);
};
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * [FUNCTION] getCountries()
 *
 * [DESCRIPTION]
 *  Obtain available country names to construct a list of keys and values
 * 
 * [INPUTS] None
 * 
 * [OUTPUTS]
 *  {'status':'<ok or error>', 
 *   'countryList': [
 *     {country: <Country name1>, shortname: <3-digit short name1>},
 *     ..], 
 *   'message': '<Message>'}
 * 
 * [NOTE]
 * 
 */
async function getCountries() {
  let retVal = {'status':'error', 'countryList': [], 'message': '[COVID-19] Country not found'};
  let url = restURL + "countries";
  if (devMode) console.log("[URL]", url);
  const result = await httpGet(url);

  if (result != null && result.length > 0) {
    for (let n = 0; n < result.length; n++) {
      let element = {};
      element['country'] = result[n].country;
      element['shortname']  = result[n].countryInfo.iso3;
      retVal.countryList.push(element);
    }

    retVal.status = 'ok';
    retVal.message = null;
  } 

  return (retVal);
};
/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

export { getCountryInfo, getCountries }

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */