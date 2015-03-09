/**
 * [resolve description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */

function waitForResult(promise, result) {
	if (result.then && typeof result.then == 'function') {
		result.then(function(val) {
			waitForResult(promise, val);
		}, function(reason) {
			promise.state = 'rejected';
			promise.change = true;
			promise.value = reason;
			propagateToChild(promise);
		});
	} else {
		promise.state = 'fulfilled';
		promise.change = true;
		promise.value = result;
		propagateToChild(promise);
	}
}

function resolve(value) {
	var promise = this;
	if (promise === value) {
		promise.state = 'rejected';
		promise.change = true;
		promise.value = TypeError('You cannot resolve a promise with itself');
		propagateToChild(promise);
	}
	if (promise.state == 'pending' && !promise.change) {
		if (value.then && typeof value.then == 'function') {
			waitForResult(promise, value);
			/*value.then(function(result) {
					promise.state = 'fulfilled';
					promise.change = true;
					promise.value = result;
					propagateToChild(promise);
				},
				function(reason) {
					promise.state = 'rejected';
					promise.change = true;
					promise.reason = reason;
					propagateToChild(promise);
				});*/
		} else {
			promise.state = 'fulfilled';
			promise.change = true;
			promise.value = value;
			propagateToChild(promise);
		}


	}

};
/**
 * [propagateToChild description]
 * @param  {[type]} promise [description]
 * @return {[type]}         [description]
 */
function propagateToChild(promise) {
	if (promise.hasChild()) {
		promise.getChild().parentResolved(promise);
	}
};


module.exports = resolve;