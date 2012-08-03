/** 
 * Laro (Game Engine Based on Canvas) 
 * Code licensed under the MIT License:
 *
 * @fileOverview Laro
 * @version 1.0
 * @author  Hongru
 * @description 
 * 
 */

/** 
 * @description
 * Package: Laro.err
 */

Laro.register('.err', function (La) {

    /**
     * RuntimeException类
     * @class 

     * @memberOf Laro
     * @name RuntimeException
     * @constructor
     * 
     * @param {String} msg: 错误信息

     * @return RuntimeException类 实例
     */
    /* runtime Error 扩展 */
    function RuntimeException (msg) {
        this.assign(msg);
    }

    RuntimeException.prototype = new Error();
    RuntimeException.prototype.constructor = RuntimeException;

    /**
     * @lends Laro.RuntimeException.prototype
     */ 
    RuntimeException.prototype.assign = function (msg) {
        this.message = msg === undefined ? '' : msg;
    };

    /**
     * AssertionError
     * @class 

     * @memberOf Laro
     * @name AssertionError
     * @constructor
     * @extends Laro.RuntimeException
     * 
     * @param {String} msg: 错误信息

     * @return AssertionError 实例
     */
    /* AssertionError */
    function AssertionError (msg) {
        this.assign(msg);
    }

    AssertionError.prototype = new RuntimeException();
    AssertionError.prototype.constructor = AssertionError;

    /**
     * Exception
     * @class 

     * @memberOf Laro
     * @name Exception
     * @constructor
     * @extends Laro.RuntimeException
     * 
     * @param {String} msg: 错误信息

     * @return Exception 实例
     */
    /* Exception */
    function Exception (msg) {
        this.assign(msg);
    }

    Exception.prototype = new RuntimeException();
    Exception.prototype.constructor = Exception;


    /**
     * 根据条件抛异常
     * 
     * @memberOf Laro
     * @function
     * 
     * @param {Boolean} condition: 抛异常的条件
     * @param {String} msg: 异常信息
     * @return AssertionError 实例
     */
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
