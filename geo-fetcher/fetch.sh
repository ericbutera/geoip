#!/bin/sh

if [ -z "$GEOIP_UPDATE_LICENSE_KEY" ]
then
  echo "GEOIP_UPDATE_LICENSE_KEY not defined"
  exit 1
fi

echo "Starting download"

if [ $ENVIRONMENT = "production" ]; then
  export GEOIP_UPDATE_URL="https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$GEOIP_UPDATE_LICENSE_KEY&suffix=tar.gz"
else
  # don't use maxmind api during testing:
  export GEOIP_UPDATE_URL="https://ericbutera.com/f/city.tar.gz?license_key=$GEOIP_UPDATE_LICENSE_KEY"
fi

echo "Starting fetch"

echo "Pulling database..."
# TODO
# - add retry
# - add error handling for non 200 status codes
# http_response=$(curl -s -o city.tar.gz -w "%{http_code}" $GEOIP_UPDATE_URL)
curl -s -o city.tar.gz $GEOIP_UPDATE_URL
# echo "Response $http_response"
# if [ $http_response != "200" ]; then
#   echo "Fatal: Unable to download Geo database"
#   exit 1
# fi

echo "Finished pulling database"

echo "Extracting database..."
tar zxvf city.tar.gz --strip-components=1 -C /data
echo "Finished extracting database"
