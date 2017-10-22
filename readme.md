# Fetch manifest

**Micro service to fetch the web app manifest of any website or PWA.**

The server fetches the given webpage, finds the manifest linked on the page (`link[rel="manifest"]`) and returns its contents.

Demo: [`fetch-manifest.now.sh/?url=https://www.voorhoede.nl`](https://fetch-manifest.now.sh/?url=https://www.voorhoede.nl).


## Parameters

The service can be configured with the following URL query parameters:

Parameter | Description | Example
--- | --- | ---
`url` (required) | URL of the web page to find and return the manifest of. | `url=https://www.voorhoede.nl`


## Development

This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/).

After installing dependencies using `npm install` the following scripts are available on all exercise branches:

`npm run ...` | Description
---|---
`deploy` | Deploys project to now and aliases latest version to [`https://fetch-manifest.now.sh`](https://fetch-manifest.now.sh).
`dev` | Starts micro service with hot reloading for development on [`http://localhost:3000`](http://localhost:3000).
`start` | Starts micro service for production on [`http://localhost:3000`](http://localhost:3000).


## License

[MIT licensed](license) © [Jasper Moelker](https://twitter.com/jbmoelker)
