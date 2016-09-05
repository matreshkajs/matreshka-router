import calc from 'matreshka/calc';
import on from 'matreshka/on';
import onDebounce from 'matreshka/ondebounce';
import trigger from 'matreshka/trigger';
import set from 'matreshka/set';

const noDebounceFlag = { debounceCalc: false };

function handleHashChange(router) {
    set(router, 'hashPath', window.location.hash, {
        hashEvent: true
    });
}

function handlePopStateChange(router) {
    set(router, 'path', window.location.pathname, {
        popEvent: true
    });
}

class Router {
    parts = [];
    path = '/';
    hashPath = '!#/';

    constructor(type) {
        // singletone pattern for history and hash router
        if (type in Router) {
            return Router[type];
        }

        this.type = type;
    }


    init() {
        if (this.initialized) return this;

        var _this = this,
            type = _this.type;

        calc(_this, 'parts', 'path', v => {
            var fixed = v.replace(/\/\//g, '/')
                .replace(/^\/|\/$/g, '');

            return fixed ? fixed.split('/') : [];
        }, noDebounceFlag);

        calc(_this, 'path', 'parts', v => {
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
        }, noDebounceFlag);

        calc(_this, 'hashPath', 'path', v => {
            return v && v != '/' ? '#!' + v : '';
        }, noDebounceFlag);

        calc(_this, 'path', 'hashPath', v => {
            return v ? v.replace(/^#!/, '') : '';
        }, noDebounceFlag);

        on(_this, 'change:parts', evt => {
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
                trigger(_this, 'pathchange');
            }
        });

        if (typeof window !== 'undefined') {
            const { document, history, location } = window;

            if (type == 'hash') {
                handleHashChange(this);

                window.addEventListener('hashchange', () => handleHashChange(this));

                onDebounce(_this, 'change:hashPath', evt => {
                    if (!evt || !evt.hashEvent) {
                        location.hash = _this.hashPath;
                    }
                }, true);
            } else if (type == 'history') {
                handlePopStateChange(this);

                window.addEventListener('popstate', evt => {
                    if (evt.state && evt.state.validPush) {
                        handlePopStateChange(this);
                    }
                });

                onDebounce(_this, 'change:path', evt => {
                    if (!evt || !evt.popEvent) {
                        history.pushState({
                            validPush: true
                        }, '', _this.path + location.hash);
                    }
                }, true);
            }
        }

        _this.initialized = true;

        return _this;

    }

    subscribe(obj, route) {
        var _this = this.init(),
            keys = route.replace(/\/\//g, '/').replace(/^\/|\/$/g, '').split('/'),
            changeEvents = [],
            filteredKeys = keys.filter(key => key != '*'),
            parts = [],
            i;

        for(i = 0; i < keys.length; i++) {
            if(keys[i] != '*') {
                changeEvents.push('change:' + keys[i]);
            }
        }

        on(obj, changeEvents, evt => {
            if (evt && evt.routeSilent) return;

            var values = [],
                i,
                value;

            for (i = 0; i < keys.length; i++) {
                value = keys[i] == '*' ? _this.parts[i] : obj[keys[i]];

                if (value) {
                    values.push(value);
                } else {
                    break;
                }
            }

            _this.parts = values;
        });

        on(_this, 'pathchange', () => {
            var i;
            for (i = 0; i < keys.length; i++) {
                if (keys[i] != '*') {
                    set(obj, keys[i], _this.parts[i] || null, {
                        routeSilent: true
                    });
                }
            }
        });

        for (i = 0; i < keys.length; i++) {
            parts.push(obj[keys[i]] == '*' ? _this.parts[i] : obj[keys[i]] || _this.parts[i]);
        }

        for (i = 0; i < keys.length; i++) {
            if(typeof obj[keys[i]] == 'undefined' && _this.parts[i] && obj[keys[i]] != '*') {
                obj.set(keys[i], _this.parts[i], {
                    routeSilent: true
                });
            }
        }

        _this.parts = parts;

        return _this;
    }
}

Router.history = new Router('history');
Router.hash = new Router('hash');


module.exports = Router;
