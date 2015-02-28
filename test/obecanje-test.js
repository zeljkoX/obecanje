var assert = require('assert');
var Promise = require('../lib/obecanje.js');


describe('Promise Specification', function() {
	describe('Promise constructor', function() {
		it('should exist and have length 1', function() {
			assert(Promise);
			assert.equal(Promise.length, 1);
		});
		it('should be a constructor', function() {
			var promise = new Promise(function() {});

			assert.equal(Object.getPrototypeOf(promise), Promise.prototype, '[[Prototype]] equals Promise.prototype');
			assert.equal(promise.constructor, Promise, 'constructor property of instances is set correctly');
			assert.equal(Promise.prototype.constructor, Promise, 'constructor property of prototype is set correctly');
		});

		it('should NOT work without `new`', function() {
			assert.throws(function() {
				Promise(function(resolve) {
					resolve('value');
				});
			}, TypeError)
		});

		it('should fulfill if `resolve` is called with a value', function(done) {
			var promise = new Promise(function(resolve) {
				resolve('value');
			});

			promise.then(function(value) {
				assert.equal(value, 'value');
				done();
			});
		});

		it('should reject if `reject` is called with a reason', function(done) {
			var promise = new Promise(function(resolve, reject) {
				reject('reason');
			});

			promise.then(function() {
				assert(false);
				done();
			}, function(reason) {
				assert.equal(reason, 'reason');
				done();
			});
		});
		it('should throw a `TypeError` if not given a function', function() {
			assert.throws(function() {
				new Promise();
			}, TypeError);

			assert.throws(function() {
				new Promise({});
			}, TypeError);

			assert.throws(function() {
				new Promise('boo!');
			}, TypeError);
		});
		it('should reject on resolver exception', function(done) {
			new Promise(function() {
				throw 'error';
			}).then(null, function(e) {
				assert.equal(e, 'error');
				done();
			});
		});

		xit('should not resolve multiple times', function(done) {
			var resolver, rejector, fulfilled = 0,
				rejected = 0;
			var thenable = {
				then: function(resolve, reject) {
					resolver = resolve;
					rejector = reject;
				}
			};

			var promise = new Promise(function(resolve) {
				resolve(1);
			});

			promise.then(function(value) {
				return thenable;
			}).then(function(value) {
				fulfilled++;
			}, function(reason) {
				rejected++;
			});

			setTimeout(function() {
				resolver(1);
				resolver(1);
				rejector(1);
				rejector(1);

				setTimeout(function() {
					assert.equal(fulfilled, 1);
					assert.equal(rejected, 0);
					done();
				}, 20);
			}, 20);

		});

	});
});