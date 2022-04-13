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

Endpoint: `/api/v1/ip/:ip`

Example: `/api/v1/ip/8.8.8.8`

#### Request
```bash
curl -H "Accept: application/json" http://localhost:3000/api/v1/ip/8.8.8.8
```

#### Response
```
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 39
```
```js
{
    "latitude": 37.751,
    "longitude": -97.822
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
    - hook up to github actions
    - containerize 
    - no auth
    - logging
    - monitoring/observability
    - [openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi#what-is-openapi)
    - rate limit?

# Development Log
Here is a running list of tasks performed to faciliate discussion.
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