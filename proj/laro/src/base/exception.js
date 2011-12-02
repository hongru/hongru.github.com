/**
 * Exception
 * error handler & notifier
 * @require [global]
 */

Laro.register('.err', function (La) {
	
	/* runtime Error 扩展 */
	function RuntimeException (msg) {
		this.assign(msg);
	}

	RuntimeException.prototype = new Error();
	RuntimeException.prototype.constructor = RuntimeException;

	RuntimeException.prototype.assign = function (msg) {
		this.message = msg === undefined ? '' : msg;
	};

	/* AssertionError */
	function AssertionError (msg) {
		this.assign(msg);
	}

	AssertionError.prototype = new RuntimeException();
	AssertionError.prototype.constructor = AssertionError;

	/* Exception */
	function Exception (msg) {
		this.assign(msg);
	}

	Exception.prototype = new RuntimeException();
	Exception.prototype.constructor = Exception;

	/* interface */
	// 根据条件抛异常
	this.assert = function (condition, msg) {
		if (!condition) {
			throw new AssertionError(msg);
		}
	};
	this.RuntimeException = RuntimeException;
	this.AssertionError = AssertionError;
	this.Exception = Exception;
    
    // export to Laro
    Laro.extend(this);

})
