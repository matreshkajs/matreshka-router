(function(root, factory) {
	/* istanbul ignore next */
	if (typeof define === 'function' && define.amd) {
		define(['matreshka'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory(require('matreshka'));
	} else {
		factory(root.Matreshka);
	}
}(this, function(MK) {
	"use strict";

	if(!MK) {
		throw Error('Matreshka is missing');
	}

	function Router(type) {
		// singletone pattern for history and hash router
		if(type in Router) {
			return Router[type];
		}

		this.type = type;
	}

	MK.extend(Router.prototype, {
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
					if(this.type == 'hash') {
						window.addEventListener('hashchange', function() {
							MK.set(this, 'hashBang', location.hash, {
								hashEvent: true
							});
						}.bind(this));

						MK.onDebounce(this, 'change:hashBang', function(evt) {
							if(!evt || !evt.hashEvent) {
								location.hash = this.hashBang;
							}
						}, true);
					} else if(this.type == 'history') {
						window.addEventListener('popstate', function(evt) {
							if(evt.state && evt.state.validPush) {
								MK.set(this, 'url', location.pathname, {
									popEvent: true
								});
							}
						}.bind(this));

						MK.onDebounce(this, 'change:url', function(evt) {
							if(!evt || !evt.popEvent) {
								history.pushState({
									validPush: true
								}, '', this.url + location.hash);
							}
						}, true);
					}
				}

				this.initialized = true;
			}
		},
		subscribe: function(obj, route) {
			var keys = route.replace(/\/\//g, '/').replace(/^\/|\/$/g, '').split('/'),
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

			return this;
		}
	});

	MK.Router = Router;
	MK.Router.history = new Router('history');
	MK.Router.hash = new Router('hash');

	MK.initRouter = function(obj, route, type) {
		MK.Router[type || 'hash'].subscribe(obj, route);
		return obj;
	};

	MK.prototype.initRouter = function(route, type) {
		MK.Router[type || 'hash'].subscribe(this, route);
		return this;
	};

	return Router;
}));
