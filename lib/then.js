/**
 * [then description]
 * @param  {function} onFulfillment [description]
 * @param  {function} onRejection   [description]
 * @return {Promise}               [description]
 */

function then(onFulfillment, onRejection) {
	var parent = this;
	var state = parent.state;
	
	if(state == 'fulfilled' && !onFulfillment || state == 'rejected' && !onRejection){
		return this;
	}

	var child = new this.constructor(function(){});
	parent.addChild(child);

	if (typeof onFulfillment == 'function') {
		child.addResolve(onFulfillment);
	}

	if (typeof onRejection == 'function') {
		child.addReject(onRejection);
	}
	if(parent.state == 'fulfilled' || parent.state == 'rejected'){
			child.parentResolved(parent);	
		
	}
	return child;
};

module.exports = then;