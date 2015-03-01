var then = require('./then.js');
var resolve = require('./resolve.js');
var reject = require('./reject.js');

/**
 * Promise function
 * @param {func} resolver
 */


var Promise = function(resolver) {
	//Values
	this.resolveFunc = undefined; //delete
	this.rejectFunc = undefined; //delete
	this.state = 'pending';
	this.states = ['pending', 'fulfilled', 'rejected'];
	this.change = false;
	this.value = undefined;
	this.reason = undefined;
	this.child = undefined;
	this.parent = undefined; 
	//Methods
	this.resolve = resolve.bind(this);
	this.reject = reject.bind(this);
	this.addResolve = addResolve;
	this.addReject = addReject;
	this.then = then;
	this.catch = catchPromise;
	this.addChild = addChild;
	this.hasChild = hasChild;
	this.getChild = getChild;
	this.parentResolved = parentResolved;
	this.assimilation = assimilation;
	this.toString = toString;


	if (typeof resolver !== 'function') {
		needResolver();
	}
	if (!(this instanceof Promise)) {
		needNew();
	}
	//Initiate resolver func
	try {
			resolver.call(null, this.resolve, this.reject);
	} catch (e) {
		this.reject(e);
	}
};


Promise.prototype = {
	constructor: Promise
};


/**
 * [transferState description]
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
function parentResolved(parent) {
	var that = this;
	var child = this;
	if(parent == this.parent){
		if(parent.state == 'fulfilled' && this.resolveFunc){
			this.assimilation(parent, child);
		} else {
			this.value = parent.value;
			this.state = parent.state;
		}

		if(parent.state == 'rejected' && this.rejectFunc){
			this.assimilation(parent, child);
		} else {
			this.reason = parent.reason;
			this.state = parent.state;
		}
	}
};

function assimilation(parent, child){
	var value = parent.state == 'fulfilled' ? parent.value : parent.reason;
	var state = parent.state == 'fulfilled' ? 'fullfiled' : 'rejected';
	var func = parent.state == 'fulfilled' ? child.resolveFunc : child.rejectFunc;
	try{
		var result = func(value);
		if(result){
			if(result.then && typeof result.then == 'function'){
				result.then(function(val){
					if(val){
						child.value = val;
						child.state = 'fulfilled';
					}
				}, function(e){
					child.reason = 2;
					child.state = 'rejected';
				});
			} else {
				child.state = 'fulfilled';
				child.value = result;
			}
		}
		else {
			child.state = parent.state;
			child.value = parent.value;
			child.reason = parent.reason;
		}
	}
	catch(e){
		child.state = 'rejected';
		child.reason = e;
	}
	finally{
		if(child.hasChild()){
			child.getChild.parentResolved(child)
		};
	}
};

/**
 * [addResolve description]
 * @param {[type]} resolve [description]
 */
function addResolve(resolve) {
	this.resolveFunc = resolve;
};
/**
 * [addReject description]
 * @param {[type]} reject [description]
 */
function addReject(reject) {
	this.rejectFunc = reject;
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
 * [addChild description]
 * @param {[type]} child [description]
 */
function addChild(child) {
	if (child) {
		this.child = child;
		child.parent = this;
	}
};

/**
 * [hasChild description]
 * @return {Boolean} [description]
 */
function hasChild(){
	return !!this.child; 
};

/**
 * [getChild description]
 * @return {[type]} [description]
 */
function getChild(){
	return this.child;
};

function toString(){
	return {'[[PromiseStatus]]' : this.state, '[[PromiseValue]]': this.value};
};
module.exports = Promise;