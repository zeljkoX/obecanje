/**
 * [reject description]
 * @param  {[type]} reason [description]
 * @return {[type]}        [description]
 */

function reject(value) {
	var promise = this;
	if (promise === value) {
		promise.state = 'rejected';
		promise.change = true;
		promise.value = TypeError('You cannot resolve a promise with itself');
		promise.reason = TypeError('You cannot resolve a promise with itself');
		propagateToChild(promise);
	}
	if (promise.state == 'pending' && !promise.change) {
		if (value.then && typeof value.then == 'function') {
			value.then(function(result) {
				promise.state = 'rejected';
				promise.change = true;
				promise.reason = result;
				promise.value = result;
			});
		} else {
			promise.state = 'rejected';
			promise.change = true;
			promise.reason = value;
			promise.value = value;
		}
	}
	if (promise.child) {
		promise.child.parentResolved(promise);
	}
};

module.exports = reject;