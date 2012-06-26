Director('tab').$define('util', function () {
    var addEvent = function (o, e, f) {
        o.addEventListener ? o.addEventListener(e, f, false) : o.attachEvent('on'+e, function () {f.call(o)});
    };
    var $ = function (o) {
        return (o.nodeType && o.nodeType == 1) ? o : (document.getElementById(o) || document.querySelector(o));
    };
    function hasClass(ele,cls) {
        return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    }

    function addClass(ele,cls) {
        if (!hasClass(ele,cls)) ele.className += " "+cls;
    }
     
    function removeClass(ele,cls) {
        if (hasClass(ele,cls)) {
            var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
            ele.className=ele.className.replace(reg,' ');
        }
    }
    function bubbleTo (el, endEl, key) {
        if (!el || (el && el == document)) {
            return null;
        } else if (el == endEl || (el.getAttribute && el.getAttribute(key))) {
            return el;
        } else if (el.parentNode) {
            return bubbleTo(el.parentNode, endEl, key);
        } else {
            return null;
        }
    }
    
    // public
    this.$ = $;
    this.addEvent = addEvent;
    this.hasClass = hasClass;
    this.addClass = addClass;
    this.removeClass = removeClass;
    this.bubbleTo = bubbleTo;
});