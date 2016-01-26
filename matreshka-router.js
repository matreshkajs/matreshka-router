(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['matreshka'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('matreshka'));
	} else {
		factory(root.Matreshka);
	}
}(this, function(MK) {console.log(MK);
	"use strict";
	var router = MK.router = {
		parts: [],
		url: '/',
		hashBang: '!#/',
		init: function() {
			if(!this.initialized) {
				MK.linkProps(this, 'parts', 'url', function(v) {
					var fixed = v.replace(/\/\//g, '/')
						.replace(/^\/|\/$/g, '');

					return fixed ? fixed.split('/') : [];
				});

				MK.linkProps(this, 'url', 'parts', function(v) {
					var parts = [];
					for(var i = 0; i < v.length; i++) {
						if(v[i]) {
							parts.push(v[i]);
						} else {
							break;
						}
					}

					return parts.length ? ('/' + parts.join('/') + '/') : '/';
				});

				MK.linkProps(this, 'hashBang', 'url', function(v) {
					return v && v != '/' ? '#!' + v : '';
				});

				MK.linkProps(this, 'url', 'hashBang', function(v) {
					return v ? v.replace(/^#!/, '') : '';
				});

				MK.on(this, 'change:parts', function(evt) {
					var value = evt.value,
						prevValue = evt.previousValue,
						equals = value.length == prevValue.length;

					if(equals) {
						for(var i = 0; i < value.length; i++) {
							if(value[i] != prevValue[i]) {
								equals = false;
								break;
							}
						}
					}

					if(!equals) {
						MK.trigger(this, 'urlchange');
					}
				});

				if(typeof window != 'undefined') {
					window.addEventListener('hashchange', function() {
						this.hashBang = document.location.hash;
					}.bind(this));

					MK.onDebounce(this, 'change:hashBang', function() {
						document.location.hash = this.hashBang;
					}, true);
				}

				this.initialized = true;
			}
		},

		subscribe: function(obj, route) {
			var mkData = MK.initMK(obj)[MK.sym],
				keys = route.replace(/\/\//g, '/').replace(/^\/|\/$/g, '').split('/'),
				filteredKeys = keys.filter(function(key) {
					return key != '*';
				}),
				parts = [];

			this.init();

			MK.on(obj, filteredKeys.map(function(key) {
				return 'change:' + key
			}).join(' '), function(evt) {
				if(evt && evt.routeSilent) return;

				var values = [];
				for(var i = 0; i < keys.length; i++) {
					if(keys[i] != '*') {
						if(obj[keys[i]]) {
							values.push(obj[keys[i]]);
						} else {
							break;
						}
					} else {
						if(this.parts[i]) {
							values.push(this.parts[i]);
						} else {
							break;
						}
					}

				}

				this.parts = values;

			}, this);

			MK.on(this, 'urlchange', function() {
				for(var i = 0; i < keys.length; i++) {
					if(keys[i] != '*') {
						MK.set(obj, keys[i], this.parts[i] || null, {
							routeSilent: true
						})
					}
				}
			});

			for(var i = 0; i < keys.length; i++) {
				parts.push(obj[keys[i]] == '*' ? this.parts[i] : obj[keys[i]] || this.parts[i]);
			}

			this.parts = parts;
		}
	};

	MK.prototype.initRouter = function(route) {
		router.subscribe(this, route);
		return this;
	};

	MK.prototype.onEquals = function(key, value, handler, thisArg, setOnInit) {
		var keyValue;
		if(typeof key == 'object') {
			onEqualsObject.call(this, key, value, handler, thisArg);
		} else if(typeof key == 'string') {
			keyValue = {};
			keyValue[key] = value;
			onEqualsObject.call(this, keyValue, handler, thisArg, setOnInit);
		}

		return this;
	};

	function onEqualsObject(keyValue, handler, thisArg, setOnInit) {
		var keys = Object.keys(keyValue);

		if(typeof thisArg != 'object') {
			setOnInit = thisArg;
			thisArg = this;
		}

		this.on(keys.map(function(key) {
			return 'change:' + key
		}).join(' '), function(evt) {
			var equals = true;

			for(var i = 0; i < keys.length; i++) {
				if(keyValue[keys[i]] != this[keys[i]]) {
					equals = false;
					break;
				}
			}

			if(equals) {
				handler.call(thisArg);
			}
		});

		if(setOnInit) {
			handler.call(thisArg);
		}
	}

	/*router.url = '/azaza/ozozo/cccccccc';
	router.subscribe(window.blah = {
		a: 'xxx'
	}, 'a/ * /c/d');


	//blah.a = 'soso'

	MK.bindNode(blah, 'a', 'input.a');
	MK.bindNode(blah, 'b', 'input.b');
	MK.bindNode(blah, 'c', 'input.c');
	MK.bindNode(blah, 'd', 'input.d');

	window.yoba = new MK;

	yoba.onEquals({
		x: 1,
		y: 2
	}, function() {
		console.log('4!');
	})

	/*var router = MK.router = {
		parts: [],
		init: function() {
			if(!this.initialized) {
				MK.on(router, 'change:url', this.onChangeUrl)
				this.initialized = true;
				if(typeof window != 'undefined') {
					window.addEventListener('hashchange', this.onHashChange.bind(this));
				}
			}
		},

		onChangeUrl: function() {
			var parts = this.parts,
				newParts = this.split(this.url),
				equals = parts.length == newParts.length;

			if(equals) {
				for(var i = 0; i < parts.length; i++) {
					if(parts[i] != newParts[i]) {
						eqials = false;
						break;
					}
				}
			}

			if(!equals) {
				this.parts = newParts;
			}

			if(typeof window != 'undefined') {
				document.location.hash = this.url;
			}

			return this;
		},

		onHashChange: function() {
			this.url = document.location.hash;
		},

		split: function(url) {
			return url.replace(/\/\//g, '/').replace(/^#!\/|^\/|\/$/g, '').split('/');
		},

		subscribe: function(inst, route) {
			var keys = this.split(route);
			this.init();
			MK.onDebounce(inst, keys.map(function(key) {
				return 'change:' + key
			}).join(' '), function() {
				var values = [];
				for(var i = 0; i < keys.length; i++) {
					if(inst[keys[i]]) {
						values.push(inst[keys[i]]);
					} else {
						break;
					}
				}

				this.url = '#!/' + values.join('/') + '/';
			}, true);

			MK.onDebounce(this, 'change:parts', function() {
				for(var i = 0; i < keys.length; i++) {
					inst[keys[i]] = this.parts[i] || null;
				}
			}, true)
		}
	};*/


}));
