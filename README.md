# rest-covid19

## REST Server Sample

This resource server provides sample REST APIs based on [disease.sh/](https://disease.sh/) , an Open Disease Data API for COVID-19. Sampling data has been finished since March 9, 2023.

### Installing Node.js

Referring to [https://nodejs.org/ja/download/](https://nodejs.org/ja/download/), install Node.js.

### Installing the Server

Using a command prompt, run the following command to instal dependent packages of Node.js.

```bash
npm install
```

### Running the Server

Using a command prompt, run the following command to run the app.

For development

```bash
npm run dev
```

For production

```bash
npm start
```

### Environmental Variables

When you start the server, it refers to some environmental variables that are defined in .env file.
Edit the file to change variables as your settings.

|  Variable Name  |  Description  |
| ---- | ---- |
|  REST_PORT | Port number of this REST server |
|  REST_URL  | Root API URL for disease.sh |
|  NODE_ENV  | development: for testing, production: Production server |

### Testing

Install Python from [https://www.python.org/downloads/](https://www.python.org/downloads/).
After running the server, run a test program implemented in Python:

```bash
python src/test.py
```

### Updated History

* May 29, 2024 - Initial version
