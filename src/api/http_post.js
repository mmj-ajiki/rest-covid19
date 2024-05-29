'use strict';

/*
 * [FILE] http_post.js
 *
 * [DESCRIPTION]
 *  Functions to access HTTP POST methods
 * 
 * [NOTE]
 *  There exist packages such as fetch and request to access HTTP.
 *  After 2022, axios is the package recommended.
 */
import axios from 'axios';

/*
 * [FUNCTION] httpPost()
 *
 * [DESCRIPTION]
 *  Access an HTTP URL to send a POST request with a JSON value
 * 
 * [INPUTS]
 *  url  - Target URL
 *  json - Data to be posted
 *  headers - Header info 
 * 
 * [OUTPUTS]
 *  Returns an appropriate JSON structure.
 *  If failed, undefined is returned.
 * 
 * [NOTE]
 * 
 */
async function httpPost(url, json, headers) {
    let data = undefined;

    await axios.post(url, json, {
        headers: headers
    })
    .then(response => {
        let body = response.data;
        //console.log("[httpPost Body] " + JSON.stringify(body));
        if (typeof body === 'object') data = body;
        else data = JSON.parse(body);
    })
    .catch(error => {
        console.log("[httpPost Error] " + JSON.stringify(error));
    });

    return data;
}

export default httpPost;

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */
