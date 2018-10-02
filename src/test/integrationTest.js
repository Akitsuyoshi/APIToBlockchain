const request = require('request');
require('chai').should();

const base = 'http://localhost:8000/block';

describe('characters', () => {
  describe('setup', () => {
  });

  describe('get', () => {
    it('should return block, height 0', (done) => {
      request.get(`${base}/0`, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.should.include.keys('hash', 'height', 'body', 'time', 'previousBlockHash');

        body.height.should.eql(0);
        body.body.should.eql('First block in the chain - Genesis block');
        body.previousBlockHash.should.eql('');
        done();
      });
    });

    it('should return error, height -1', (done) => {
      request.get(`${base}/-1`, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.should.include.keys('status', 'msg');

        body.status.should.eql('error');
        body.msg.should.eql('the block of given Id does not exist in the chain');
        done();
      });
    });
  });

  describe('post', () => {
    const options = {
      uri: `${base}`,
      form: {
        data: 'test string',
      },
    };
    it('should return block, if post is succeed', (done) => {
      request.post(options, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.should.include.keys('hash', 'height', 'body', 'time', 'previousBlockHash');

        body.body.should.eql('test string');
        done();
      });
    });

    it('should return error, if passed data is empty', (done) => {
      options.form.data = '';
      request.post(options, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.should.include.keys('status', 'msg');

        body.status.should.eql('error');
        body.msg.should.eql('data should include some content in string');
        done();
      });
    });
  });
});
