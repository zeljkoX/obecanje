var Promise = require('./lib/obecanje.js');
var assert = require('assert');
debugger;
var originalThenable = {
	then: function(onFulfilled) {
		/*setTimeout(function() {
			onFulfilled('original value');
		}, 0);*/
		onFulfilled('original value');
	}
};
var promise = new Promise(function(resolve) {
	resolve(originalThenable);
});

promise.then(function(value) {
	assert.equal(value, 'original value');
	done();
});