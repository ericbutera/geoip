'use strict'
const request = require('supertest');
const assert = require('assert');

describe('geoapi', () => {
  let app;
  beforeEach(() => {
    app = require('../index')
  });

  afterEach(() => { app.close() });

  it('responds to 8888', function testGoogleDns(done) {
    request(app)
      .get('/ip/8.8.8.8')
      .expect('Content-Type', /json/)
      .then(response => {
        assert(response.body.geo.latitude, 37.751)
        assert(response.body.geo.longitude, -97.822)
        done()
      })
      .catch(err => done(err));
  })

  it('rejects on malformed ip', (done) => {
    request(app)
      .get('/ip/asdf')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        assert(response.body.message, 'asdf is invalid')
        done()
      })
      .catch(err => done(err));
  })

  it('errors on invalid ip', (done) => {
    request(app)
      .get('/ip/127.0.0.1')
      .expect('Content-Type', /json/)
      .expect(404)
      .then(response => {
        assert(response.body.message, 'The address 127.0.0.1 is not in the database')
        done()
      })
      .catch(err => done(err));
  })

  // TODO:
  // test health endpoint
  // test ip invalid format
  // test ip 500 errors
  // test ip 404 missing route

});
