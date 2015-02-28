/**
 * 
 */

function then(resolve, reject) {
	if (arguments.length == 1 && typeof arguments[0] !== 'function') {
		needResolver();
	}

	if (typeof resolve == 'function') {
		this.addResolve(resolve);
	}

	if (typeof reject == 'function') {
		this.addReject(reject);
	}
};

module.exports = then;