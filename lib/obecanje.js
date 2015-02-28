var then = require('./then.js');

/**
 * Promise function
 * @param {func} resolver
 */


var Promise = function(resolver) {
	//Values
	this.resolvers = [];
	this.rejects = [];
	this.state = 'pending';
	this.states = ['pending', 'fulfiled', 'rejected'];
	this.change = false;
	this.value = undefined;
	this.reason = undefined;
	//Methods
	this.resolve = resolve.bind(this);
	this.reject = reject.bind(this);
	this.runResolvers = runResolvers;
	this.runRejects = runRejects;
	this.addResolve = addResolve;
	this.addReject = addReject;
	this.checkState = checkState;
	this.then = then;
	this.catch = catchPromise;

	if (typeof resolver !== 'function') {
		needResolver();
	}
	if (!(this instanceof Promise)) {
		needNew();
	}
	//Initiate resolver func
	try{
		resolver.call(null, this.resolve, this.reject);
	}
	catch(e){
		this.reject(e);
	}
};


Promise.prototype = {
	constructor: Promise
};

/**
 * Throw Error
 * @return {[type]} [description]
 */

function needResolver() {
	throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
};

/**
 * [needNew description]
 * @return {[type]} [description]
 */

function needNew() {
	throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
};

/**
 * Empty function
 *
 */

function noop() {};

/**
 * [resolve description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function resolve(value) {
	var that = this;
	if (this.state == 'pending' && !this.change) {
		this.state = 'fulfiled';
		this.change = true;
		this.value = value;
		setTimeout(function() {
			that.runResolvers();
		}, 0);
	}
};

/**
 * [reject description]
 * @param  {[type]} reason [description]
 * @return {[type]}        [description]
 */
function reject(reason) {
	var that = this;
	if (this.state == 'pending' && !this.change) {
		this.state = 'rejected';
		this.change = true;
		this.reason = reason;
		setTimeout(function() {
			that.runRejects();
		}, 0);
	}
};
/**
 * [runResolvers description]
 * @return {[type]} [description]
 */
function runResolvers() {
	var value = this.value;
	if (!this.resolvers.length) {
		return;
	}
	this.resolvers.forEach(function(item) {
		setTimeout(function() {
			item.call(null, value)
		}, 0);
	});
	this.resolvers.length = 0;
};
/**
 * [runRejects description]
 * @return {[type]} [description]
 */
function runRejects() {
	var reason = this.reason;
	if (!this.rejects.length) {
		return;
	}
	this.rejects.forEach(function(item) {
		setTimeout(function() {
			item.call(null, reason)
		}, 0);
	});
	this.rejects.length = 0;
};

/**
 * [addResolve description]
 * @param {[type]} resolve [description]
 */
function addResolve(resolve) {
	this.resolvers.push(resolve);
	this.checkState();
};
/**
 * [addReject description]
 * @param {[type]} reject [description]
 */
function addReject(reject) {
	this.rejects.push(reject);
	this.checkState();
};

/**
 * [checkState description]
 * @return {[type]} [description]
 */
function checkState() {
	switch (this.state) {
		case 'pending':
			return;
			break;
		case 'fulfiled':
			this.runResolvers();
			break;
		case 'rejected':
			this.runRejects();
			break;
	}
};

/**
 * [catch description]
 * @return {[type]} [description]
 */
function catchPromise(reject) {
	if (!reject || typeof reject !== 'function') {
		return;
	}
	this.addReject(reject);
};

module.exports = Promise;