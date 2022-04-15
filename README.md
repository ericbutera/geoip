# Geo API
Geo-location web services utilizing [Maxmind GeoIP](https://www.maxmind.com/) database.

# API Documentation

## Authorization
At this time there isn't any authorization built into the application.

## Supported Clients
The API only supports the JSON content-type at this time.

## API Endpoints

### IP
Look up Geo location of a provided Internet Protocol (IP) address.

Endpoint: `/ip/:ip`

Example: `/ip/8.8.8.8`

#### Request
```bash
curl -H "Accept: application/json" http://localhost:3000/ip/8.8.8.8
```

#### Response
```
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
```
```js
{
    "latitude": 37.751,
    "longitude": -97.822
}
```

### Health
Health check endpoint.
Endpoint: `/health`

#### Request
```bash
curl -H "Accept: application/json" http://localhost:3000/health
```

#### Response
```
< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
```
```js
{
    "message": "OK"
}
```

#### Status Codes
| Status Code | Description                                             |
|-------------|---------------------------------------------------------|
| 200         | Success                                                 |
| 404         | Address Not found                                       |
| 400         | Value Error: Happens if the IP syntax is not recognized |
| 500         | Unexpected Error: Try the request again                 |

# Testing
To run the test suite use npm: `npm test`

# Running the Server
The server can be ran stand-alone.
```bash
npm install
npm start
```

# Project Roadmap
```
#### Response


#### Status Codes
| Status Code | Description                                             |
|-------------|---------------------------------------------------------|
| 200         | Success                                                 |
| 404         | Address Not found                                       |
| 400         | Value Error: Happens if the IP syntax is not recognized |
| 500         | Unexpected Error: Try the request again                 |

# Testing
To run the test suite use npm: `npm test`

# Running the Server
The server can be ran stand-alone.
```bash
npm install
npm start
```

# Project Roadmap
Major project milestones and future enhancements are listed here.
- kubernetes
    - node app is public
    - geoupdater private
    - secrets manager for API key
- geoupdater
    - use geoupdater?
        - risk as its third party, could cause downtime
        - not immediately obvious what it updates or where the output goes
    - use csv OR mmdb
        - requires comparing sha256 against download
        - issue head for checking if fetch necessary
        - app needs restart after fetch
- app todo:
    - logging (at least console log reqs)
    - hook up to github actions
    - [openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi#what-is-openapi)
    - no auth

# Development Log
Here is a running list of tasks performed to faciliate discussion.
- added health check, updated readme
- github actions wont work until i figure out how to include *.mmdb
- added more test cases as comments
- added api docs to readme
- wrote integration test
- added mocha
- build image `docker build . -t ericbutera/geoapi`
    - docker.io/ericbutera/geoapi
- added gitignore, dockerfile, docker ignore
- bootstrapped simple express app reading static database
- need to keep in mind the Geo API key will be an ENV var 
- looked into geoip docker
    - https://github.com/maxmind/geoipupdate/blob/main/doc/docker.md
- download static database
    - https://www.maxmind.com/en/accounts/705712/geoip/downloads
    - GeoLite2 City 
- add @maxmind/geoip2-node
    - https://dev.maxmind.com/geoip/docs/databases?lang=en#official-api-clients
- scaffold project npm init
- review https://12factor.net/