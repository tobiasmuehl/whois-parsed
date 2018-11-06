const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-datetime'));
const assert = chai.assert;
var whoisParser = require('../index');

//TODO Add unit tests that use stored whois responses

function randomString(length, chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function testNotAvailable (base, tld, options = {}) {
  var result = await whoisParser(base + tld);
  expect(result['domainName']).to.equal(base + tld);
  expect(result['isAvailable']).to.equal(false);
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('expirationDate'))) {
    assert.beforeDate(new Date(), new Date(result['expirationDate']));
  }
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('creationDate'))) {
    assert.afterDate(new Date(), new Date(result['creationDate']));
  }
  if (!(options.hasOwnProperty('excludedFields') && options.excludedFields.includes('updatedDate'))) {
    assert.afterDate(new Date(), new Date(result['updatedDate']));
  }
  expect(result['status'].length).to.be.above(0);
}

async function testAvailable (tld) {
  var rString = randomString(32);
  var result = await whoisParser(rString + tld);
  expect(result['domainName']).to.equal(rString + tld);
  expect(result['isAvailable']).to.equal(true);
  expect(result.hasOwnProperty('creationDate')).to.be.false;
  expect(result.hasOwnProperty('updatedDate')).to.be.false;
  expect(result.hasOwnProperty('expirationDate')).to.be.false;
  expect(result.hasOwnProperty('status')).to.be.false;
};
    
describe('#whoisParser integration tests', function() {
    it('known .com should not be available and have data', async function () {
      await testNotAvailable('google', '.com');
    });
    it('random .com domain should be available', async function() {
      await testAvailable('.com');
    });
    
    it('known .net should not be available and have data', async function () {
      await testNotAvailable('google', '.net');
    });
    it('random .net domain should be available', async function() {
      await testAvailable('.net');
    });
    
    it('known .org should not be available and have data', async function () {
      await testNotAvailable('google', '.org');
    });
    it('random .org domain should be available', async function() {
      await testAvailable('.org');
    });
    
    it('known .name should not be available and have data', async function () {
      await testNotAvailable('google', '.name', { excludedFields: ['creationDate', 'expirationDate', 'updatedDate']});
    });
    it('random .name domain should be available', async function() {
      await testAvailable('.name');
    });
    
    it('known .me should not be available and have data', async function () {
      await testNotAvailable('google', '.me');
    });
    it('random .me domain should be available', async function() {
      await testAvailable('.me');
    });
    
    it('known .au should not be available and have data', async function () {
      await testNotAvailable('google.com', '.au', { excludedFields: ['creationDate', 'expirationDate']});
    });
    it('random .au domain should be available', async function() {
      await testAvailable('.com.au');
    });
});