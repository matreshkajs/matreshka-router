import Router from './router';

function initRouter(obj, route, type) {
	Router[type || 'hash'].subscribe(obj, route);
	return obj;
}

if(typeof Matreshka === 'function') {
	Matreshka.Router = Router;
	Matreshka.initRouter = initRouter;
}

module.exports = initRouter;
