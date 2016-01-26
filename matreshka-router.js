(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['matreshka'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('matreshka'));
	} else {
		factory(root.Matreshka);
	}
}(this, function(MK) {
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
				keys = route.replace(/\/\//g, '/').replace(/^\/|\/$/g, '').split('/').filter(function(key) {
					return key != '*';
				}),
				parts = [];

			this.init();

			MK.on(obj, keys.map(function(key) {
				return 'change:' + key
			}).join(' '), function(evt) {
				if(evt && evt.routeSilent) return;

				var values = [];
				for(var i = 0; i < keys.length; i++) {
					if(obj[keys[i]]) {
						values.push(obj[keys[i]]);
					} else {
						break;
					}
				}

				this.parts = values;

			}, this);

			MK.on(this, 'urlchange', function() {
				for(var i = 0; i < keys.length; i++) {
					MK.set(obj, keys[i], this.parts[i] || null, {
						routeSilent: true
					})
				}
			});

			for(var i = 0; i < keys.length; i++) {
				parts.push(obj[keys[i]] || this.parts[i]);
			}

			this.parts = parts;
		}
	};

	router.url = '/azaza/ozozo/';
	router.subscribe(window.blah = {
		a: 'xxx'
	}, 'a/b/c/d');


	blah.a = 'soso'

	MK.bindNode(blah, 'a', 'input.a');
	MK.bindNode(blah, 'b', 'input.b');
	MK.bindNode(blah, 'c', 'input.c');
	MK.bindNode(blah, 'd', 'input.d');



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
