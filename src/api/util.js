/*
 * [FILE] util.js
 * 
 * [DESCRIPTION]
 *  Utility functions commonly used in this REST server
 * 
 * [NOTE]
 */
import randomstring from "randomstring";
import crypto from "crypto";
import base64url from "base64url";

/*
 * [FUNCTION] generateCodeChallenge()
 *
 * [DESCRIPTION]
 *  Generate a hashed string from a code verifier
 * 
 * [INPUTS]
 *  code_verifier - Randomly generated string
 * 
 * [OUTPUTS]
 */
function generateCodeChallenge(code_verifier) {

  const base64Digest = crypto
    .createHash("sha256")
    .update(code_verifier)
    .digest("base64");
  
  const code_challenge = base64url.fromBase64(base64Digest);

  return code_challenge;
}
/*
 * HISTORY
 * [1] JUN-06-2024 - Initial version
 */

/*
 * [FUNCTION] generateCodeVerifier()
 *
 * [DESCRIPTION]
 *  Generate random string
 * 
 * [INPUTS] None
 * 
 * [OUTPUTS]
 */
function generateCodeVerifier() {
  const code_verifier = randomstring.generate(128);

  return code_verifier;
}
/*
* HISTORY
* [1] JUN-06-2024 - Initial version
*/

export { generateCodeChallenge, generateCodeVerifier }

/*
 * FILE HISTORY
 * [1] JUN-06-2024 - Initial version
 */ 