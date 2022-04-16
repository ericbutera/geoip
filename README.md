# Geo API
Geo-location web services utilizing [Maxmind GeoIP](https://www.maxmind.com/) database.

# Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [git](https://git-scm.com/downloads)
- [node/npm](https://nodejs.org/en/download/) (if running tests)

# Quickstart
1. Clone the code: `git clone git@github.com:ericbutera/geoip.git`
2. [Configure API Key](#MaxMind-API-Key)
3. Run Deployment: `kubectl apply -f kubernetes/geo-deployment.yml`
4. Port forward: `kubectl port-forward deployment/geoip-web 8080:8080`
5. (Optional) Use the [Postman collection](https://github.com/ericbutera/geoip/blob/main/geo-api-postman.json)

# Configuration
This project is intended to be orchestrated via Kubernetes in Docker Desktop. All configuration is handled by environment variables. By default only the MaxMind API requires configuration.

## MaxMind API Key
To set the API key, run this command:
```
kubectl create secret generic geo-api-key --from-literal=geo-api-key='API-KEY-VALUE'
```

## Environment Variables
- Geo API
    - GEOAPI_PORT - which port to bind to
    - GEOAPI_DATABASE_PATH - path to GeoLite city database (mmdb)
- Geo Fetcher
  - GEOIP_UPDATE_LICENSE_KEY - configured with kubectl secret key
  - ENVIRONMENT
    - test - (default) uses the test server
    - production - live connection to MaxMind which requires a valid API key

## Container Registry
DockerHub is the expected Container Service registry.
- [geoapi](https://hub.docker.com/repository/docker/ericbutera/geoapi)
- [geofetcher](https://hub.docker.com/repository/docker/ericbutera/geo-fetcher)

# API Documentation

## Authorization
At this time there isn't any authorization built into the application.

## Supported Clients
The API only supports the JSON content-type at this time.

## API Endpoints
- [ip](#IP)
- [health](#Health)

### IP
Look up Geo location of a provided Internet Protocol (IP) address.

Endpoint: `/ip/:ip`

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
In order to run the tests you will need a copy of the GeoLite2 City database. This can be obtained from [MaxMind](https://dev.maxmind.com/geoip/updating-databases?lang=en#directly-downloading-databases) for free after creating an account. The API key management is located [here](https://www.maxmind.com/en/accounts/current/license-key).

Once you have `GeoLite2-City_*.tar.gz`, extract and define the environment variable `GEOAPI_DATABASE_PATH` to the full path of the mmdb file.

Example:
```sh
# TODO - i usually verify from scratch these things work, but I ran out of time.
# Note: replace YOUR_LICENSE_KEY with the license key from your account
curl -o ~/Download/city.tar.gz https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=YOUR_LICENSE_KEY&suffix=tar.gz

cd ~/Downloads
tar zxvf city.tar.gz
export GEOAPI_DATABASE_PATH=~/Downloads/GeoLite2-City.mmdb
npm test
```

# Running the Server
The server can be ran stand-alone.
```bash
npm install
npm start
```

# Project Requirements
- API resolving lat/long for an IP
- Use MaxMind GeoLite2 database (contains geo data for ip)
- Kubernetes orchestrates workflow:
  - fetch/update Geo database (every "several weeks")
  - start/restart API server to use new database
- Launch with single command:
  - `kubectl apply`
  - `helm install`
  - `make deploy`

# Project Roadmap
Major project milestones and future enhancements are listed here.
- images
  - it would be nice to have the docker images published; perhaps a github action can do this?
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
- fixed api tests; I was relying on old versioned api & the mmdb database existing within the project
- added port forwarding instructions
- figured out k8s secrets from the command line: `kubectl create secret generic geo-api-key --from-literal=geo-api-key='API-KEY-VALUE'`
- i realized my repo, containers, and app names became out of sync as the project moved along. i would like to rename things to geo-* for consistency.
- created geo-fetcher image
    - the process is complicated enough to warrant usage of a bash script
    - added output showing progress
    - added geo-fetcher README to show commands on building image
- added initial k8s orchestration in kubernetes/geo-deployment.yml
- updated app to use ENV config
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
