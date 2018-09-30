const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
require('chai').should();

const blocks = require('./mockDataForTest');

const baseURL = 'http://localhost:3000/block';

describe('API', () => {
  let headerObj;
  let errObj;
  beforeEach(() => {
    headerObj = {
      statusCode: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'Content-Length': '238',
        connection: 'close',
        'Cache-Control': 'no-cache',
      },
    };
    errObj = {
      status: 'error', msg: 'the block of given Id does not exist in the chain',
    };
    this.get = sinon.stub(request, 'get');
    this.post = sinon.stub(request, 'post');
  });
  afterEach(() => {
    request.get.restore();
    request.post.restore();
  });

  it('should have header in a correct manner', () => {
    this.get.yields(null, headerObj, JSON.stringify({}));
    request.get(baseURL, (err, res, body) => {
      res.statusCode.should.eql(200);
      res.headers['content-type'].should.contain('application/json; charset=utf-8');
      res.headers['Content-Length'].should.contain('238');
      res.headers['Cache-Control'].should.contain('no-cache');
      res.headers.connection.should.contain('close');

      expect(body).to.deep.equal(JSON.stringify({}));
    });
  });

  describe('GET request', () => {
    it('should return response 0 height block to get call', () => {
      this.get.yields(null, headerObj, JSON.stringify(blocks[0]));
      request.get(`${baseURL}/0`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: 'a449da79cb962e1ad2f33afd3e60c11ee044ee42feeb1d6d7286bc496bfe2578',
          height: 0,
          body: 'First block in the chain - Genesis block',
          time: '1538090051',
          previousBlockHash: '',
        }));
      });
    });

    it('should return response, 1 height block to get call', () => {
      this.get.yields(null, headerObj, JSON.stringify(blocks[1]));
      request.get(`${baseURL}/1`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: 'c524497b60a4378e63e134c7c27b1a4431c7d3e3ae4f720348095937cf0bb9b8',
          height: 1,
          body: 'Test Block - 1',
          time: '1538090052',
          previousBlockHash: 'a449da79cb962e1ad2f33afd3e60c11ee044ee42feeb1d6d7286bc496bfe2578',
        }));
      });
    });

    it('should return response error if block is not existed', () => {
      headerObj.statusCode = 404;
      this.get.yields(null, headerObj, JSON.stringify(errObj));
      request.get(`${baseURL}/12`, (err, res, body) => {
        res.statusCode.should.equal(404);
        expect(body).to.deep.equal(JSON.stringify({
          status: 'error', msg: 'the block of given Id does not exist in the chain',
        }));
      });
    });
  });

  describe('POST request', () => {
    it('should return response once user post the new block', () => {
      this.post.yields(null, headerObj, JSON.stringify(blocks[8]));
      request.post(baseURL, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: '6456a64ff9376a261cdabf3c072ac7e581fc89ee9c03966e41c4268a579b023e',
          height: 8,
          body: 'Test Block - 8',
          time: '1538090059',
          previousBlockHash: 'c7642feb2eb989fe9ae0fdac0313cd3f73783a8a374be5ccdbbdf20f7659e202',
        }));
      });
    });
  });
});
