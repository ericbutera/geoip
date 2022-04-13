'use strict'

const express = require('express');
const app = express();
const base = '/api/v1';

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

// MaxMind API docs 
// https://maxmind.github.io/GeoIP2-node/
// https://maxmind.github.io/GeoIP2-node/classes/City.html
const fs = require('fs');
const Reader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync('city.mmdb'); // TODO: how to "auto-update and make this file available"
const reader = Reader.openBuffer(dbBuffer);

/**
 * IP Endpoint: /api/v1/ip/127.0.0.1
 * @param {Request}
 * @param {Response}
 */
app.get(base + '/ip/:ip', (req, res) => {
  // TODO: tidy up code; a bit harsh to look at
  try {
    let geo = reader.city(req.params['ip']);
    if (geo && geo.location) {
      return res.json({
        // always nest data in case api response needs to be enhanced
        geo: {
          latitude: geo.location.latitude,
          longitude: geo.location.longitude
        }
      })
    }
  } catch (e) {
    return handleIpException(res, e)
  }

  return apiError(res, 500, 'Unexpected Error', 'Unknown');
});

/**
 * Convert raw errors into REST friendly format
 * @param {Response} res 
 * @param {Error} e 
 * @returns {Response}
 */
const handleIpException = (res, e) => {
  switch (e.name) {
    case 'AddressNotFoundError':
      return apiError(res, 404, 'Address not found', e.message);
    case 'ValueError':
      return apiError(res, 400, 'Format not supported', e.message);
  }
  return apiError(res, 500, 'Unexpected Error', e.message);
};

/**
 * Enforce API error contract
 * @param {Response} res 
 * @param {number} code 
 * @param {string} message 
 * @param {string} error 
 * @returns {Response}
 */
const apiError = (res, code, message, error) => {
  return res
    .status(code)
    .json({
      message: message,
      error: error
    });
};

app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' })
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: 'Error', error: err })
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Running on ${port}`);
});

module.exports = server;