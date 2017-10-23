# Fetch manifest

**Micro service to fetch the web app manifest of any website or PWA.**

The server fetches the given webpage, finds the manifest linked on the page (`link[rel="manifest"]`) and returns its contents.

Demo: [`fetch-manifest.now.sh/?url=https://www.voorhoede.nl`](https://fetch-manifest.now.sh/?url=https://www.voorhoede.nl).


## Table of contents

* [Requests](#requests)
  * [Parameters](#parameters)
* [Responses](#responses)
  * [Successful response](#successful-response)
  * [Error response](#error-response)
* [Development](#development)


## Requests

### Parameters

The service can be configured with the following URL query parameters:

Parameter | Description | Example
--- | --- | ---
`url` (required) | URL of the web page to find and return the manifest of. | `url=https://www.voorhoede.nl`


## Responses

### Successful response

Successful responses are indicated with a 200 HTTP code and a JSON-based payload containing the `manifestUrl` where the web app manifest was found and the `manifest` itself. Example [`?url=https://www.voorhoede.nl`](https://fetch-manifest.now.sh/?url=https://www.voorhoede.nl) responds with:

```json
{
  "manifestUrl": "https://www.voorhoede.nl/assets/manifest-d110dc52f9.json",
  "manifest": {
    "short_name": "De Voorhoede",
    "name": "De Voorhoede Front-end Developers",
    "start_url": "/?homescreen=true",
    "display": "standalone",
    "orientation": "portrait",
    "gcm_sender_id": "482941778795",
    "theme_color": "#12353C",
    "background_color": "#E7D81D",
    "icons": [
      {
        "src": "/assets/images/logo-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/assets/images/logo-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
}
```


### Error response

Error responses are served with a non-200-series HTTP code and a JSON-based payload containing a list of `errors`. The `errors/code` node will indicate a `CAPS_CASE` constant error code you can programmatically consume to make resolution decisions from. The `errors/message` node provides a human-readable description of the error. Additional fields may be attached to indicate finer-grained detail about the error.

HTTP code | Error code | Extra info
--- | --- | ---
`400` | `MISSING_PARAMETER` | `error.parameter` contains parameter name.
`404` | `MISSING_MANIFEST` | 
`405` | `METHOD_NOT_ALLOWED` | 
`500` | `FETCH_ERROR` | 
`500` | `INVALID_MANIFEST` | 

Example:

```json
{
  "errors": [
    {
      "code": "MISSING_PARAMETER",
      "parameter": "url",
      "message": "'url' query parameter is required.",
      "docs": "https://github.com/jbmoelker/fetch-manifest#parameters"
    }
  ]
}
```


## Development

This project requires [Node.js](http://nodejs.org/) (>= v8) and [npm](https://npmjs.org/) (comes with Node).

After installing dependencies using `npm install` the following scripts are available on all exercise branches:

`npm run ...` | Description
---|---
`deploy` | Deploys project to now and aliases latest version to [`https://fetch-manifest.now.sh`](https://fetch-manifest.now.sh).
`dev` | Starts micro service with hot reloading for development on [`http://localhost:3000`](http://localhost:3000).
`start` | Starts micro service for production on [`http://localhost:3000`](http://localhost:3000).


## License

[MIT licensed](license) © [Jasper Moelker](https://twitter.com/jbmoelker)
