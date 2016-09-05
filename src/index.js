/* globals Matreshka */

import Router from './router';

function initRouter(obj, route, type) {
    Router[type || 'hash'].subscribe(obj, route);
    return obj;
}

/* istanbul ignore if */
if (typeof Matreshka === 'function') {
	foobar(); // eslint-disable-line
    Matreshka.Router = Router;
    Matreshka.initRouter = initRouter;
}

module.exports = initRouter;
