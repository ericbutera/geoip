# Geo API
Geo-location web services utilizing [MaxMind GeoLite City](https://www.maxmind.com/) database.

The overall goals of kubernetes orchestrating a fetch and launch of the API server have been completed. There is a kubernetes deployment called [geo-deployment.yml](kubernetes/geo-deployment.yml) that will be applied. Please follow the [Requirements](#requirements) and [Quickstart](#quickstart) to get started. 

I created [Project Roadmap](#project-roadmap) and [Development Log](#development-log) to write down development challenges. 

# Table of Contents
- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Running the Server](#running-the-server)
- [Project Requirements](#project-requirements)
- [Development Log](#development-log)

# Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [git](https://git-scm.com/downloads)
- [node/npm](https://nodejs.org/en/download/) (if running tests on your machine)

# Quickstart
1. Clone the code: `git clone git@github.com:ericbutera/geoip.git`
2. [Configure API Key](#MaxMind-API-Key)
3. Run Deployment: `kubectl apply -f kubernetes/geo-deployment.yml`
4. Port forward: `kubectl port-forward deployment/geoip-web 8080:8080`
5. (Optional) Use the [Postman collection](https://github.com/ericbutera/geoip/blob/main/geo-api-postman.json)

# Configuration
This project is intended to be orchestrated via Kubernetes in Docker Desktop. All configuration is handled by environment variables. By default only the MaxMind API requires configuration.

Note: If the API key secret is missing the `geoip-web-*` container will end up with the status `Init:CreateContainerConfigError`.

## MaxMind API Key
A MaxMind account is required to obtain GeoLite databases. MaxMind API keys are located [here](https://www.maxmind.com/en/accounts/current/license-key).

To set the API key for use in Kubernetes, run this command:
```
kubectl create secret generic geo-api-key --from-literal=geo-api-key='API-KEY-VALUE'
```

Once the API key is set, change geo-fetcher's `ENVIRONMENT` to `production` in [geo-deployment.yml](https://github.com/ericbutera/geoip/blob/69752dd1c7c60a94e071b03ae4d13940e2a76a25/kubernetes/geo-deployment.yml#L33).

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
The API server can be ran stand-alone. This will require a local copy of the MaxMind database along with a development environment using NodeJS.
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

# Project Roadmap
Major project milestones and future enhancements are listed here.
- architecture
    - follow advice on [12 factor app](https://12factor.net/)
    - future architecture concerns:
        - geo fetcher
            - update at intervals
            - cache into a secure bucket
            - add resiliency around IO errors 
                - MaxMind
                - own cloud storage
        - API server 
            - gracefully restart upon some event that the database was updated
    - load balancer: real-world apps require uptime Service Level Agreement (SLAs) to be met
        - api gateway
            - multiple app processes
    - rate limiting
    - observability & metrics
        - proof of SLA adherence 
        - APM spans/traces
        - logging
- kubernetes
    - TODO
        - load balancer, api gateway, geoapp instances
        - replicas 
        - image container service: it would be nice to have the docker images auto-published; perhaps a github action can do this?
        - look into helm charts 
    - DONE
        - geoapi node app is public (using kubectl port forwarding)
        - secrets manager: using kubectl secrets
        - geo fetch pulls database in init containers
- geoupdater
    - TODO:
        - compare sha256 against download (prevent forgery)
        - issue HEAD for checking if fetch necessary
        - api server needs restart after fetch
    - Ideas not used:
        - ~custom geo-fetch (see geo-fetcher directory)~~
        - ~~use geoupdater?~~ NO
            - ~~risk as its third party, could cause downtime~~
            - ~~not immediately obvious what it updates or where the output goes~~
        - ~~use csv OR mmdb~~ MMDB
- app:
    - TODO:
        - add ability to run tests:
            - on build server (github actions)
            - in k8 so deps aren't required on host
        - logging (at least console log reqs)
        - hook up github actions
            - there was a hurdle with the geo database as a dependency
        - [openapi docs](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi#what-is-openapi)
        - add auth

# Development Log
Here is a running list of tasks performed to faciliate discussion.
- final pass at README, no code changes
- added better error handling and retry on fetcher
- tested on mac, documented error with secret not being set
- fixed api tests; I was relying on old versioned api & the mmdb database existing within the project
- added port forwarding instructions
- figured out k8s secrets from the command line: `kubectl create secret generic geo-api-key --from-literal=geo-api-key='API-KEY-VALUE'`
- i realized my repo, containers, and app names became out of sync as the project moved along. i would like to rename things to geo-* for consistency.
- created geo-fetcher image
    - using init container
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
