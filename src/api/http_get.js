'use strict';

/*
 * [FILE] http_get.js
 *
 * [DESCRIPTION]
 *  Functions to access HTTP GET methods
 * 
 * [NOTE]
 *  There exist packages such as fetch and request to access HTTP.
 *  After 2022, axios is the package recommended.
 */
import axios from 'axios';

/*
 * [FUNCTION] httpGet()
 *
 * [DESCRIPTION]
 *  Access an HTTP URL to send a GET request
 * 
 * [INPUTS]
 *  url - Target URL
 * 
 * [OUTPUTS]
 *  The function returns appropriate data from the specified URL.
 *  If failed, it returns null.
 * 
 * [NOTE]
 * 
 */
async function httpGet(url) {
    let data = null;

    try {
        const res = await axios(url);
        //console.log(res.data);
        data = res.data;
    } catch (err) {
        console.error(err.name + ": " + err.message);
        console.error("[URL] " + url);
    }

    return data;
}

export default httpGet;

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */