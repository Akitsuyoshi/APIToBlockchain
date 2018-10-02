const request = require('request');
require('chai').should();

const base = 'http://localhost:3000/api';

describe('characters', () => {
  describe('setup', () => {
  });

  describe('get', () => {
    it('should return all characters in a correct format', (done) => {
      request.get(`${base}`, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.status.should.eql('success');

        body.charas.length.should.eql(12);
        // the first object in the data array should
        // have the right keys
        body.charas[0].should.include.keys('id', 'name', 'gender', 'skill', 'url', 'from', 'createdAt');
        // the first object should have the right value for name
        body.charas[0].name.should.eql('Kumamon');
        body.charas[0].from.should.eql('Kumamoto');
        done();
      });
    });

    it('should return specific chara by its id', (done) => {
      request.get(`${base}/3`, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');

        body = JSON.parse(body);
        body.status.should.eql('success');
        body.oneChara.should.include.keys('id', 'name', 'gender', 'skill', 'from', 'url', 'createdAt');

        // the first object should have the right value for name
        body.oneChara.name.should.eql('Nishiko-kun');
        body.oneChara.from.should.eql('nishikokun_project');
        done();
      });
    });
    it('should return specific chara by its from', (done) => {
      request.get(`${base}/from/Niigata`, (err, res, body) => {
        res.statusCode.should.eql(200);
        res.headers['content-type'].should.contain('application/json');
        body = JSON.parse(body);
        console.log(body);
        body.status.should.eql('success');
        body.oneChara.should.include.keys('id', 'name', 'gender', 'skill', 'from', 'url', 'createdAt');
        // the first object should have the right value for name
        body.oneChara.name.should.eql('Reruhi-san');
        body.oneChara.from.should.eql('Niigata');
        done();
      });
    });
  });

  // describe.skip("put", () => {
  //   it("should update the character given the id", () => {
  //     bofore(() => {
  //       knex("localchara").
  //     })
  //     request.put(`${base}/`)
  //   })
  // })
});
