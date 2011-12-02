/**
 * create new world of a game
 * game starts from here
 * @require [global, base.Class]
 */

Laro.register('.world', function (La) {
 
	var Class = Laro.base.Class,
		$resource = Laro.resource,
		$err = Laro.err,
		$audio = Laro.audio,
		toType = Laro.toType,
		curry = Laro.curry,
		doc = window.document,
		self = this;

	var World = Class(function (canvas, stateList, callback) {
		if (arguments.length < 2) { throw new $err.Exception('canvas or stateList wrong') }

		this.canvas = toType(canvas) == 'string' ? (doc.querySelector(canvas) || doc.getElementById(canvas)) : canvas;
		this.callback = callback;

		this.frontToBack = false;
		this.debug = false;
		this.showFPS = false;
		this.freezeFrame = false;

		this.resources = new $resource.Store();
		this.resources.setCallback(curry(this.callback, this));
		//实例指向
		$resource.Store.instance = this.resources;

		// game 的有限状态机
		this.fsm = new self.FSM(self, stateList);
		this.audioTransition = new $audio.Transition(0.25);
		this.game = new Laro.Game(this.resources);
		this.audio = new Laro.Audio();

		this.render = null;

	}).statics({
		
	}).methods({
		
	});

	Laro.extend({ World: World });
	self.create = function (canvas, callback) {
		return new World(canvas, callback);
	}
 
 });


