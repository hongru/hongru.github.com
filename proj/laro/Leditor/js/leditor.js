/**
 * Laro Editor
 */
Laro.register('.$lea', function (La) {
	
	var pkg = this,
		loader = null,
		sourceObj = null;
	
	var getAnimation = function (name, fromObj, useLoader) {
		
	};
	
	this.setSourceObj = function (o) {
		sourceObj = o;
		this.sourceObj = o;
	};
	this.setLoader = function (l) {
		loader = l;
		this.loader = l;
	};
	
});