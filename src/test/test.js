const { expect } = require('chai');
const sinon = require('sinon');
const request = require('request');
require('chai').should();

const blocks = require('./mockDataForTest');

const baseURL = 'http://localhost:3000';

describe('API', () => {
  let headerObj;
  let errObj;
  let bBody;
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
      status: 'error',
      msg: 'the block of given Id does not exist in the chain',
    };
    bBody = {
      address: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ',
      star: {
        ra: '16h 29m 1.0s',
        dec: "-26° 29' 24.9",
        story: '466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f',
        storyDecoded: 'Found star using https://www.google.com/sky/',
      },
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
    request.get(`${baseURL}/block`, (err, res, body) => {
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
      request.get(`${baseURL}/block/0`, (err, res, body) => {
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
      const b = blocks[1];
      b.body = bBody;

      this.get.yields(null, headerObj, JSON.stringify(blocks[1]));
      request.get(`${baseURL}/block/1`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: 'c524497b60a4378e63e134c7c27b1a4431c7d3e3ae4f720348095937cf0bb9b8',
          height: 1,
          body: bBody,
          time: '1538090052',
          previousBlockHash: 'a449da79cb962e1ad2f33afd3e60c11ee044ee42feeb1d6d7286bc496bfe2578',
        }));
      });
    });

    it('should return response error if block is not existed', () => {
      this.get.yields(null, headerObj, JSON.stringify(errObj));
      request.get(`${baseURL}/block/12`, (err, res, body) => {
        expect(body).to.deep.equal(JSON.stringify({
          status: 'error', msg: 'the block of given Id does not exist in the chain',
        }));
      });
    });

    it('should return response, correspoinding to passed wallet address', () => {
      const b = blocks[1];
      b.body = bBody;

      this.get.yields(null, headerObj, JSON.stringify(blocks[1]));
      request.get(`${baseURL}/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: 'c524497b60a4378e63e134c7c27b1a4431c7d3e3ae4f720348095937cf0bb9b8',
          height: 1,
          body: bBody,
          time: '1538090052',
          previousBlockHash: 'a449da79cb962e1ad2f33afd3e60c11ee044ee42feeb1d6d7286bc496bfe2578',
        }));
      });
    });

    it('should return response, correspoinding to passed hash value', () => {
      const b = blocks[1];
      b.body = bBody;

      this.get.yields(null, headerObj, JSON.stringify(blocks[1]));
      request.get(`${baseURL}/stars/hash:c524497b60a4378e63e134c7c27b1a4431c7d3e3ae4f720348095937cf0bb9b8`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: 'c524497b60a4378e63e134c7c27b1a4431c7d3e3ae4f720348095937cf0bb9b8',
          height: 1,
          body: bBody,
          time: '1538090052',
          previousBlockHash: 'a449da79cb962e1ad2f33afd3e60c11ee044ee42feeb1d6d7286bc496bfe2578',
        }));
      });
    });

    it('should return response last block, which is called best block', () => {
      this.get.yields(null, headerObj, JSON.stringify(blocks[10]));
      request.get(`${baseURL}/bestBlock`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: '26b90ad9d81bb4e309453ca076dec0a17bda4b16c6dfae891e86fd62e901ed15',
          height: 10,
          body: 'Test Block - 10',
          time: '1538090061',
          previousBlockHash: '85baa4a66a6a242c7804e9b0fc68a6a91a51711470ef94ee0a5c478194fc17dc',
        }));
      });
    });
  });

  describe('POST request', () => {
    it('should return response once user post the new block', () => {
      const b = {
        address: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ',
        star: {
          ra: '16h 29m 1.0s',
          dec: "-26° 29' 24.9",
          story: 'Found star using https://www.google.com/sky/',
        },
      };
      // eslint-disable-next-line
      b.star.story = Buffer.from(b.star.story, 'utf8').toString('hex');
      // console.log(b.star);
      blocks[8].body = b;
      this.post.yields(null, headerObj, JSON.stringify(blocks[8]));
      request.post(`${baseURL}/block`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify({
          hash: '6456a64ff9376a261cdabf3c072ac7e581fc89ee9c03966e41c4268a579b023e',
          height: 8,
          body: b,
          time: '1538090059',
          previousBlockHash: 'c7642feb2eb989fe9ae0fdac0313cd3f73783a8a374be5ccdbbdf20f7659e202',
        }));
      });
    });

    it('should return error if star story is over 251 words', () => {
      const b = {
        address: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ',
        star: {
          ra: '16h 29m 1.0s',
          dec: "-26° 29' 24.9",
          story: 'a'.repeat(251),
        },
      };
      this.post.yields(null, headerObj, JSON.stringify(b));
      request.post(`${baseURL}/block`, (err, res, body) => {
        if (JSON.parse(body).star.story.length > 250) {
          body = JSON.stringify({
            status: 'error',
            msg: 'star story should be described within 250 words.',
          });
        }
        expect(body).to.deep.equal(JSON.stringify({
          status: 'error',
          msg: 'star story should be described within 250 words.',
        }));
      });
    });

    it('should return error if star does not correct props', () => {
      const b = {
        address: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ',
        star: {
          ra: '16h 29m 1.0s',
          dec: "-26° 29' 24.9",
        },
      };
      this.post.yields(null, headerObj, JSON.stringify(b));
      request.post(`${baseURL}/block`, (err, res, body) => {
        const check = (obj, prop) => Object.hasOwnProperty.call(obj, prop);
        const { star } = JSON.parse(body);
        if (star.length !== 3 || check(star, 'dec') || check(star, 'ra') || check(star, 'story')) {
          body = JSON.stringify({
            status: 'error',
            msg: 'star should contain 3 props, dec, ra, and story',
          });
        }
        expect(body).to.deep.equal(JSON.stringify({
          status: 'error',
          msg: 'star should contain 3 props, dec, ra, and story',
        }));
      });
    });

    it('should return response once user request validation for registry', (done) => {
      const response = {
        address: '17RebJGPcUX3z7zoWJdmUgkBbvZ7BAKPCB',
        requestTimeStamp: '1532296090',
        message: '17RebJGPcUX3z7zoWJdmUgkBbvZ7BAKPCB:1532296090:starRegistry',
        validationWindow: 300,
      };

      this.post.yields(null, headerObj, JSON.stringify(response));
      request.post(`${baseURL}/requestValidation`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify(response));
      });
      done();
    });
    it('should return err once validationWindow is 0', (done) => {
      const response = {
        status: 'error',
        msg: 'Please try again because validation time is expired now',
      };

      this.post.yields(null, headerObj, JSON.stringify(response));
      request.post(`${baseURL}/requestValidation`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify(response));
      });
      done();
    });

    it('should return response once user request validation for message signature', (done) => {
      const payload = {
        address: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ',
        signature: 'H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU=',
      };

      const response = {
        registerStar: true,
        status: {
          address: payload.address,
          requestTimeStamp: '1532296090',
          message: '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry',
          validationWindow: 193,
          messageSignature: 'valid',
        },
      };

      this.post.yields(null, headerObj, JSON.stringify(response));
      request.post(`${baseURL}/message-signature/validate`, (err, res, body) => {
        res.statusCode.should.equal(200);
        expect(body).to.deep.equal(JSON.stringify(response));
      });
      done();
    });
  });
});
