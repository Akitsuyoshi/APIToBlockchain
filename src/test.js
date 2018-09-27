const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
require('chai').should();

const baseURL = 'http://localhost:3000/block';

describe('API', () => {
  beforeEach(() => {
    this.get = sinon.stub(request, 'get');
    this.post = sinon.stub(request, 'post');
  });
  afterEach(() => {
    request.get.restore();
    request.post.restore();
  });

  it('should have header in a correct manner', () => {
    this.get.yields(null, {
      statusCode: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'Content-Length': '238',
        connection: 'close',
        'Cache-Control': 'no-cache',
      },
    }, JSON.stringify({}));
    request.get(baseURL, (err, res, body) => {
      res.statusCode.should.eql(200);
      res.headers['content-type'].should.contain('application/json; charset=utf-8');
      res.headers['Content-Length'].should.contain('238');
      res.headers['Cache-Control'].should.contain('no-cache');
      res.headers.connection.should.contain('close');

      expect(body).to.deep.equal(JSON.stringify({}));
    });
  });
});
