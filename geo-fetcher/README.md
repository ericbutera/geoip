 # Overview
Geo Fetcher is a container that downloads the compressed Maxmind GeoIP database and extracts into a directory.

# Build Steps
```sh
docker build -t ericbutera/geo-fetcher .
docker run --rm -v "$PWD/data:/data" ericbutera/geo-fetcher
docker image push ericbutera/geo-fetcher
```

# Future Enhancements
- Only pull the database if the data has changed. This can be accomplished by issuing a `head` request.
- Store fetch result in a spot where tests & app can use even if MaxMind is unavailable
