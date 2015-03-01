/**
 * [resolve description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */

function resolve(value) {

	var promise = this;
	if (promise.state == 'pending' && !promise.change) {
		if (value.then && typeof value.then == 'function') {
			//if(value.state == 'pending')
			value.then(function(result) {
				promise.state = 'fulfilled';
				promise.change = true;
				promise.value = result;
			}, function(reason){
				promise.state = 'rejected';
				promise.change = true;
				promise.reason = reason;
			});
		} else {
			promise.state = 'fulfilled';
			promise.change = true;
			promise.value = value;
		}
		if (promise.hasChild()) {
			promise.getChild().parentResolved(promise);
		}

	}

};

module.exports = resolve;