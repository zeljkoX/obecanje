/**
 * [reject description]
 * @param  {[type]} reason [description]
 * @return {[type]}        [description]
 */

function reject(value) {
	var promise = this;
	if (promise.state == 'pending' && !promise.change) {
		if (value.then && typeof value.then == 'function') {
			value.then(function(result) {
				promise.state = 'rejected';
				promise.change = true;
				promise.reason = result;
			});
		} else {
			promise.state = 'rejected';
			promise.change = true;
			promise.reason = value;
		}
	}
	if (promise.child) {
		promise.child.parentResolved(promise);
	}
};

module.exports = reject;