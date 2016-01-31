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

	/* istanbul ignore if */
	if (!MK) {
		throw Error('Matreshka is missing');
	}

	var linkProps = MK.linkProps,
		onDebounce = MK.onDebounce,
		on = MK.on,
		set = MK.set,
		win = typeof window != 'undefined' ? window : null;

	function Router(type) {
		// singletone pattern for history and hash router
		if (type in Router) {
			return Router[type];
		}

		this.type = type;
	}

	MK.extend(Router.prototype, {
		parts: [],
		url: '/',
		hashBang: '!#/',
		init: function() {
			if (this.initialized) return;

			var _this = this,
				type = _this.type,
				location = document.location;


			linkProps(_this, 'parts', 'url', function(v) {
				var fixed = v.replace(/\/\//g, '/')
					.replace(/^\/|\/$/g, '');

				return fixed ? fixed.split('/') : [];
			});

			linkProps(_this, 'url', 'parts', function(v) {
				var parts = [],
					i;
				for (i = 0; i < v.length; i++) {
					if (v[i]) {
						parts.push(v[i]);
					} else {
						break;
					}
				}

				return parts.length ? ('/' + parts.join('/') + '/') : '/';
			});

			linkProps(_this, 'hashBang', 'url', function(v) {
				return v && v != '/' ? '#!' + v : '';
			});

			linkProps(_this, 'url', 'hashBang', function(v) {
				return v ? v.replace(/^#!/, '') : '';
			});

			on(_this, 'change:parts', function(evt) {
				var value = evt.value,
					prevValue = evt.previousValue,
					equals = value.length == prevValue.length,
					i;

				if (equals) {
					for (i = 0; i < value.length; i++) {
						if (value[i] != prevValue[i]) {
							equals = false;
							break;
						}
					}
				}

				if (!equals) {
					MK.trigger(_this, 'urlchange');
				}
			});

			if (win) {
				if (type == 'hash') {
					win.addEventListener('hashchange', function() {
						set(_this, 'hashBang', location.hash, {
							hashEvent: true
						});
					});

					onDebounce(_this, 'change:hashBang', function(evt) {
						if (!evt || !evt.hashEvent) {
							location.hash = _this.hashBang;
						}
					}, true);
				} else if (type == 'history') {
					win.addEventListener('popstate', function(evt) {
						if (evt.state && evt.state.validPush) {
							set(_this, 'url', location.pathname, {
								popEvent: true
							});
						}
					});

					onDebounce(_this, 'change:url', function(evt) {
						if (!evt || !evt.popEvent) {
							history.pushState({
								validPush: true
							}, '', _this.url + location.hash);
						}
					}, true);
				}
			}

			_this.initialized = true;

			return _this;

		},
		subscribe: function(obj, route) {
			var _this = this,
				keys = route.replace(/\/\//g, '/').replace(/^\/|\/$/g, '').split('/'),
				changeEvents = [],
				filteredKeys = keys.filter(function(key) {
					return key != '*';
				}),
				parts = [],
				i;

			_this.init();

			for(i = 0; i < keys.length; i++) {
				if(keys[i] != '*') {
					changeEvents.push('change:' + keys[i]);
				}
			}

			on(obj, changeEvents, function(evt) {
				if (evt && evt.routeSilent) return;

				var values = [],
					i,
					value;

				for (i = 0; i < keys.length; i++) {
					value = keys[i] != '*' ? obj[keys[i]] : _this.parts[i];

					if (value) {
						values.push(value);
					} else {
						break;
					}
				}

				_this.parts = values;
			});

			on(_this, 'urlchange', function() {
				var i;
				for (i = 0; i < keys.length; i++) {
					if (keys[i] != '*') {
						set(obj, keys[i], _this.parts[i] || null, {
							routeSilent: true
						})
					}
				}
			});

			for (i = 0; i < keys.length; i++) {
				parts.push(obj[keys[i]] == '*' ? _this.parts[i] : obj[keys[i]] || _this.parts[i]);
			}

			_this.parts = parts;

			return _this;
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
