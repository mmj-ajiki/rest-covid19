# rest-covid19

## REST Server Sample

This resource server provides sample REST APIs based on [disease.sh](https://disease.sh/) , an Open Disease Data API for COVID-19. Sampling data has been finished since March 9, 2023.

### Installing Node.js

Referring to [https://nodejs.org/ja/download/](https://nodejs.org/ja/download/), install Node.js.

### Generating Public and Private Keys

You need to install openssl ([https://www.openssl.org/](https://www.openssl.org/)) to generate keys for authentication.

Generate a private key file and put it in the folder specified by an environment variable 'PRIVATE_KEY_FILE'.

```bash
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048
```

Generate a public key file and put it in the folder specified by an environment variable 'PUBLIC_KEY_FILE'.

```bash
openssl rsa -pubout -in keys/private.pem -out keys/public.pem
```

### Installing the Server

Using a command prompt, run the following command to instal dependent packages of Node.js.

```bash
npm install
```

If you have a message about high severity vulnerability, run the following command:

```bash
npm audit fix
```

### Running the Server

Using a command prompt, run the following command to run the app.

For development (logs are shown on the command prompt)

```bash
npm run dev
```

For production

```bash
npm start
```

### Environmental Variables

When you start the server, it refers to some environmental variables that are defined in .env file.
You can find a template file named 'env.tpl' and edit the file to set variables, and rename it to .env.

|  Variable Name  |  Description  |
| ---- | ---- |
|  CLIENT_ID | Client ID for authentication |
|  COVID19_REST_URL  | Root API URL of the COVID-19 API (do not change) |
|  PRIVATE_KEY_FILE | Private key file path |
|  PUBLIC_KEY_FILE  | Public key file path |
|  REDIRECT_URI | Callback path for authentication |
|  REST_PORT | Port number of this REST server (initial setting: 5000) |

### Testing

Install Python from [https://www.python.org/downloads/](https://www.python.org/downloads/).
After running the server, access to the local host such as <http://localhost:5000> from a Web browser. On the browser, follow the steps:

- Click the Authentication button on the top page
- Enter a user name and the password, then click the Login button
- 'Get Token' appears on the top page, click it
- Access token is shown as follows:

```bash
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer"
}
```

Run a test program implemented in Python. It exists underneath the src folder.

```bash
python src/test.py <Access token>
```

### REST APIs

This server provides REST API endpoints, each of which returns a common JSON structure:

```json
{
   'keys': ['key1', 'key2', ... 'keyN'], # A list of keys used in the records
   'records': [
       {'key1': value-11, 'key2': value-21, ... 'keyN': value-N1}, 
       {'key1': value-12, 'key2': value-22, ... 'keyN': value-N2}, 
       ...,
       {'key1': value-1m, 'key2': value-2m, ... 'keyN': value-Nm}, 
   ],
   'message': Error message or null(success)
}
```

Each endpoint requires a Bearer token for authentication in the header as follows:

```json
{
    'Authorization': 'Bearer <Access token>'
}
```

#### /rest/countries

Returns available country names and short names from the COVID-19 API.

|  Method  |  Request  |
| ---- | ---- |
|  GET | None |

Response:

|  Key  | Description  |
| ---- | ---- |
| country | Country full name |
| shortname | 3-digit name of the country |

Response Example:

```json
{
   'keys': ['country', 'shortname'], 
   'records': [
       {'country': 'Afghanistan', 'shortname': 'AFG'}, 
       {'country': 'Albania', 'shortname': 'ALB'}, 
       ...
   ],
   'message': null
}
```

#### /rest/country_info

Returns the latest status of COVID-19 in the specified country.

|  Method  |  Request  |
| ---- | ---- |
|  POST | {'country': \<Country Name (required)\>} |

Response:

|  Key  | Description  |
| ---- | ---- |
| active | Number of infected persons |
| critical | Number of seriously ill persons |
| recovered | Discharge/end of treatment |
| cases | Total number of infected persons |
| deaths | Total number of deaths |
| tests | Number of tests |

Response Example:

```bash
{
   'keys': ['active', 'critical', 'recovered', 'cases', 'deaths', 'tests'],
   'records': [
       {'active': 786167, 'critical': 940, 'recovered': 109814428, 'cases': 111820082, 'deaths': 1219487, 'tests': 1186851502}
   ],
   'message': null
}
```

#### /rest/history

Returns daily historical data within the number of days of the specified country.

|  Method  |  Request  |
| ---- | ---- |
|  POST | {'country': \<Country Name (required)\>, 'num_of_days': \<Days (optional) \>} |

Response:

|  Key  | Description  |
| ---- | ---- |
| date | Date (epoch datetime) |
| num_cases | Number of infected persons on that date |
| num_deaths | Number of deaths on that date |

Response Example:

```bash
{
   'keys': ['date', 'num_cases', 'num_deaths'], 
   'records': [
       {'date': 1677250800, 'num_cases': 2749, 'num_deaths': 14}, 
       {'date': 1677337200, 'num_cases': 1606, 'num_deaths': 1},  
       ...
   ],
   'message': null
}
```

### Testing with GEMBA Note

- Restore the backup file (covid-19__<Version>__backup.gncproj) underneath the package folder in GEMBA Note
- Confirm that this sample server runs
  - If you run it on Windows as a local server, make the loopback adapter available using a command prompt --> [Notices for Windows OS](./NoticesForWindows.md)
- Open the "Getting Started" note in the development package folder and read the steps to run the app

### Updated History

- October 11, 2024 - Updated packages
- June 6, 2024 - Added authentication
- May 29, 2024 - First release
