/*
 * [FILE] cors.js
 * 
 * [DESCRIPTION]
 *  Methods for CORS (Cross-Origin Resource Sharing) 
 * 
 * [NOTE]
 */

/*
 * [FUNCTION] restSetHedersForCors()
 *
 * [DESCRIPTION]
 *  Set headers for CORS (Cross-Origin Resource Sharing) to a response
 * 
 * [INPUTS] None
 * 
 * [OUTPUTS] None
 */
function restSetHedersForCors(response) {
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader('Access-Control-Allow-Methods', "OPTIONS,POST,GET");
}

export default restSetHedersForCors;

/*
 * HISTORY
 * [1] MAY-29-2024 - Initial version
 */

/*
 * FILE HISTORY
 * [1] MAY-29-2024 - Initial version
 */ 