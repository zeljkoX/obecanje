var Promise = require('./lib/obecanje.js');
var assert = require('assert');
console.log(Promise);
var promise = new Promise(function(resolve) {
	resolve('zeljko');
});

promise.then(function(value) {
	console.log('resolved');
	assert.equal(value, 'zeljko');
});