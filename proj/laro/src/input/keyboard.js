/**
 * laro input 
 * keyboard.js
 */

// 保证一个 keyboard 的事件注册在一个游戏里面只注册一次
Laro.register('.input', function (La) {
	var pkg = this;
	var keyHash = {
		'a': 65,
		'b': 66,
		'c': 67,
		'd': 68,
		'e': 69,
		'f': 70,
		'g': 71,
		'h': 72,
		'i': 73,
		'j': 74,
		'k': 75,
		'l': 76,
		'm': 77,
		'n': 78,
		'o': 79,
		'p': 80,
		'q': 81,
		'r': 82,
		's': 83,
		't': 84,
		'u': 85,
		'v': 86,
		'w': 87,
		'x': 88,
		'y': 89,
		'z': 90,

		'0': 48,
		'1': 49,
		'2': 50,
		'3': 51,
		'4': 52,
		'5': 53,
		'6': 54,
		'7': 55,
		'8': 56,
		'9': 57,

		'blank': 32,
		'backspace': 8,
		'esc': 27,
		'tab': 9,
		'enter': 13,

		'~': 192,
		'-': 189,
		'_': 189,
		'+': 187,
		'=': 187,
		'{': 219,
		'[': 219,
		'}': 221,
		']': 221,
		'|': 220,
		':': 186,
		';': 186,
		'"': 222,
		'<': 188,
		'>': 190,
		'?': 191,

		'up': 38,
		'down': 40,
		'left': 37,
		'right': 39,

		'shiftKey': 16,
		'ctrlKey': 17,
		'altKey': 18
	};
	
	var Keyboard = La.Class(function (canvas) {
		this.target = canvas || window || window.document;
		this.keyHash = keyHash;
		this.keyStatus = {};
		this.keyStack = [];
		this._downKey = null;
		this._upKey = null;
		this._lastKeyupTime = (+new Date);
		this.checkTime = 200;
		this.maxStackLength = 10;
		this.bind();
	}).methods({
		bind: function () {
			var _this = this;
			this.target.addEventListener('keydown', function (e) { _this.keydown(e) }, false);
			this.target.addEventListener('keyup', function (e) { _this.keyup(e) }, false);
		},
		getKeyName: function (keyCode) {
			for (var name in keyHash) {
				if (keyHash[name] == keyCode) {
					return name;
				}
			}
			return keyCode;
		},
		keydown: function (e) {
			if (this.keyStack.length == 0 || (+new Date) - this._lastKeyupTime > this.checkTime) {
				this.resetKeyStack();
			}
			var name = this.getKeyName(e.keyCode);
			!this.key(name) && this.pushToStack(name);
			this.keyStatus[name] = true;
			this._downKey = name;
		},
		keyup: function (e) {
			var name = this.getKeyName(e.keyCode);
			this.keyStatus[name] = false;
			this._upKey = name;

			//this.updateKeyStack();
		},
		/**
		 * 判断某个键是否按下
		 * 按下为true, 否则false
		 */
		key: function (name) {
			return !!this.keyStatus[name];	 
		},
		// 更新keyStack,主要是用于一些组合键的判断
		pushToStack: function (name) {
			var t = (+new Date);
			if (t - this._lastKeyupTime > this.checkTime) {
				this.resetKeyStack(t);
				return;
			}
			this._lastKeyupTime = t;
			this.keyStack.push(name);
			var l = this.keyStack.length,
				tmpStack = this.keyStack;
			if (l > this.maxStackLength) {
				this.keyStack = tmpStack.splice(l - this.maxStackLength);
			}
		},
		resetKeyStack: function (t) {
			this.keyStack = [];
			this._lastKeyupTime = t || (+new Date);
		}
		
	}).statics({
		
		
	});

	this.Keyboard = Keyboard;
	La.extend({ Keyboard: Keyboard });
		
})
