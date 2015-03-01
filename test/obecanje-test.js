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

		it('should not resolve multiple times', function(done) {
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

	describe('assimilation', function() {
		it('should assimilate if `resolve` is called with a fulfilled promise', function(done) {
			var originalPromise = new Promise(function(resolve) {
				resolve('original value');
			});
			var promise = new Promise(function(resolve) {
				resolve(originalPromise);
			});

			promise.then(function(value) {
				assert.equal(value, 'original value');
				done();
			});
		});

		it('should assimilate if `resolve` is called with a rejected promise', function(done) {
			var originalPromise = new Promise(function(resolve, reject) {
				reject('original reason');
			});
			var promise = new Promise(function(resolve) {
				resolve(originalPromise);
			});

			promise.then(function() {
				assert(false);
				done();
			}, function(reason) {
				assert.equal(reason, 'original reason');
				done();
			});
		});

		it('should assimilate if `resolve` is called with a fulfilled thenable', function(done) {
			var originalThenable = {
				then: function(onFulfilled) {
					/*setTimeout(function() {
						onFulfilled('original value1');
					}, 0);*/
				onFulfilled('original value');
				}
			};
			var promise = new Promise(function(resolve) {
				resolve(originalThenable);
			});

			var c = promise.then(function(value) {
				assert.equal(value, 'original value1');
				done();
			});
		});

		xit('should assimilate if `resolve` is called with a rejected thenable', function(done) {
			var originalThenable = {
				then: function(onFulfilled, onRejected) {
					setTimeout(function() {
						onRejected('original reason');
					}, 0);
				}
			};
			var promise = new Promise(function(resolve) {
				resolve(originalThenable);
			});

			promise.then(function() {
				assert(false);
				done();
			}, function(reason) {
				assert.equal(reason, 'original reason');
				done();
			});
		});


		xit('should assimilate two levels deep, for fulfillment of self fulfilling promises', function(done) {
			var originalPromise, promise;
			originalPromise = new Promise(function(resolve) {
				setTimeout(function() {
					resolve(originalPromise);
				}, 0)
			});

			promise = new Promise(function(resolve) {
				setTimeout(function() {
					resolve(originalPromise);
				}, 0);
			});

			promise.then(function(value) {
				assert(false);
				done();
			})['catch'](function(reason) {
				assert.equal(reason.message, "You cannot resolve a promise with itself");
				assert(reason instanceof TypeError);
				done();
			});
		});

		xit('should assimilate two levels deep, for fulfillment', function(done) {
			var originalPromise = new Promise(function(resolve) {
				resolve('original value');
			});
			var nextPromise = new Promise(function(resolve) {
				resolve(originalPromise);
			});
			var promise = new Promise(function(resolve) {
				resolve(nextPromise);
			});

			promise.then(function(value) {
				assert.equal(value, 'original value');
				done();
			});
		});

		xit('should assimilate two levels deep, for rejection', function(done) {
			var originalPromise = new Promise(function(resolve, reject) {
				reject('original reason');
			});
			var nextPromise = new Promise(function(resolve) {
				resolve(originalPromise);
			});
			var promise = new Promise(function(resolve) {
				resolve(nextPromise);
			});

			promise.then(function() {
				assert(false);
				done();
			}, function(reason) {
				assert.equal(reason, 'original reason');
				done();
			});
		});

		xit('should assimilate three levels deep, mixing thenables and promises (fulfilled case)', function(done) {
			var originalPromise = new Promise(function(resolve) {
				resolve('original value');
			});
			var intermediateThenable = {
				then: function(onFulfilled) {
					setTimeout(function() {
						onFulfilled(originalPromise);
					}, 0);
				}
			};
			var promise = new Promise(function(resolve) {
				resolve(intermediateThenable);
			});

			promise.then(function(value) {
				assert.equal(value, 'original value');
				done();
			});
		});

		xit('should assimilate three levels deep, mixing thenables and promises (rejected case)', function(done) {
			var originalPromise = new Promise(function(resolve, reject) {
				reject('original reason');
			});
			var intermediateThenable = {
				then: function(onFulfilled) {
					setTimeout(function() {
						onFulfilled(originalPromise);
					}, 0);
				}
			};
			var promise = new Promise(function(resolve) {
				resolve(intermediateThenable);
			});

			promise.then(function() {
				assert(false);
				done();
			}, function(reason) {
				assert.equal(reason, 'original reason');
				done();
			});
		});
	});
});