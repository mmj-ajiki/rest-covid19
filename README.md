# rest-covid19

## REST Server Sample

This resource server provides sample REST APIs based on [disease.sh](https://disease.sh/) , an Open Disease Data API for COVID-19. Sampling data has been finished since March 9, 2023.

### Installing Node.js

Referring to [https://nodejs.org/ja/download/](https://nodejs.org/ja/download/), install Node.js.

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

When you start the server, it refers to a couple of environmental variables that are defined in .env file.
Edit the file to change variables as your settings.

|  Variable Name  |  Description  |
| ---- | ---- |
|  REST_PORT | Port number of this REST server (initial setting: 5000) |
|  REST_URL  | Root API URL of the COVID-19 API (do not change) |

### Testing

Install Python from [https://www.python.org/downloads/](https://www.python.org/downloads/).
After running the server, run a test program implemented in Python:

```bash
python src/test.py
```

### REST APIs

This server provides REST API endpoints, each of which returns a common JSON structure:

```bash
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

```bash
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

### Updated History

* May 29, 2024 - First release
