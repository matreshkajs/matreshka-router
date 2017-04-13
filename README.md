A router for Matreshka.js
============

[![Coverage Status](https://coveralls.io/repos/github/matreshkajs/matreshka-router/badge.svg?branch=master)](https://coveralls.io/github/matreshkajs/matreshka-router?branch=master) [![Build Status](https://travis-ci.org/matreshkajs/matreshka-router.svg?branch=master)](https://travis-ci.org/matreshkajs/matreshka-router) [![npm version](https://badge.fury.io/js/matreshka-router.svg)](https://badge.fury.io/js/matreshka-router)


[Demo](https://matreshkajs.github.io/matreshka-router/demo.html#!/foo/bar/baz/)

Installing:
```
npm install --save matreshka-router
```

A bundle (downloadable version) lives at [gh-pages branch](https://github.com/matreshkajs/matreshka-router/tree/gh-pages)

# tl;dr

The library turns on two-way data binding between properties and parts of URL.

```js
// location.hash is used there
Matreshka.initRouter(object, '/a/b/c/');
object.a = 'foo';
object.b = 'bar';
object.c = 'baz';

// makes location.hash to be #!/foo/bar/baz/
```

If you need to use History API instead of hash, pass ``"history"`` as the second argument.

```js
Matreshka.initRouter(object, '/a/b/c/', 'history');
```

CJS module import:

```js
const initRouter = require('matreshka-router');
initRouter(object, '/a/b/c/', 'history');
```

--------


How does "traditional" routing works? A developer defines a rule (route) and defines a function which will be called when current path fits given rule.

```js
route("books/:id", id => {
	// do something
});
```

The principle of **matreshka-router** is different. You define which part of URL (both [hash](https://developer.mozilla.org/ru/docs/Web/API/Window/location), and [HTML5 History](https://developer.mozilla.org/ru/docs/Web/API/History_API) are supported) need to be synchronized with given property.

Let's say you need to synchronize ``"x"`` with the first part of ``location.hash`` and ``"y"`` with the second.

```js
Matreshka.initRouter(object, '/x/y/');
```

Now when you type...

```js
object.x = 'foo';
object.y = 'bar';
```

...``location.hash`` is automatically changed to ``#!/foo/bar/``


And vice versa. When the URL is changed manually or via back and forward buttons, the properties will be changed automatically.

```js
location.hash = '#!/baz/qux/';

// ... after a moment
console.log(object.x, object.y); // ‘baz’, ‘qux’
```

As usually you can listen property changes with [Matreshka#on](http://matreshka.io/#!Matreshka-on) method.

```js
Matreshka.on(object, 'change:x', handler);
// for Matreshka instances: this.on('change:x', handler);
```

## An asterisk syntax

You can pass a string which contain asterisks to ``initRouter`` if you don't need to synchronize some part of the path with a property.

```js
Matreshka.initRouter(object, '/x/*/y');
```

If the hash looks like ``#!/foo/bar/baz/``, then ``this.x = "foo"`` and ``this.y = "baz"``.

This feature is useful in cases when classes control different parts of the path.


**class1.js**

```js
Matreshka.initRouter(this, '/x/*/');
```

**class2.js**

```js
Matreshka.initRouter(this, '/*/y/');
```

## Two things to remember

**1.** If a property has truthy value then URL will be changed immediately after ``initRouter`` call.


```js
object.x = 'foo';

Matreshka.initRouter(object, '/x/y/');
```

**2.** If a property gets falsy value then all next listed properties will get ``null`` as new value.

```js
Matreshka.initRouter(object, '/x/y/z/u/');

Matreshka.y = null; // makes this.z and this.u to be null as well
```

The idea is to get actual state of URL. It could be weird to get ``"z"`` with value ``"foo"`` in case of non-existing bound part of URL.

## HTML5 History API

The plugin supports  HTML5 History as well. To initialize it you need to pass optional argument ``type`` with ``"history"`` value to the ``initRoute`` function (by default ``type`` is ``"hash"``).

```js
Matreshka.initRouter(object, 'x/y/z/', 'history');
```

## CommonJS import

If an application is located at CJS environment  (NodeJS, Webpack, Rollup...) then requiring ``matreshka-router`` doesn't add any static properties to ``Matreshka`` class.

```js
const initRouter = require('matreshka-router');
initRouter(object, '/x/y/');
```

``Router`` class import (read below):

```js
const Router = require('matreshka-router/router');
const customRouter = new Router('myType');
```

## Additional information

### ``Matreshka.Router`` class

**matreshka-router** is powered by  ``Matreshka.Router`` class. It accepts only one argument - router type (``"hash"``, ``"history"`` or a custom string).

By default, the library creates two instances of ``Matreshka.Router`` with types ``hash`` and ``history``. They live at ``Matreshka.Router.hash`` and ``Matreshka.Router.history``. **matreshka-router** uses lazy initialization so when you just attach the script onto webpage, the library does nothing.

For these two types of instances the singleton pattern is used. That means when you're trying to create another instance of ``hash`` routing via ``new Matreshka.Router('hash')``, the ``Matreshka.Router.hash`` will be returned instead of new instance creation. This logic centralizes URL handling, gives positive effect to the performance and doesn't make potential collisions. Objects which are handled by ``initRouter`` just subscribe to the changes of needed type of the router.

Custom instances (non-hash and non-history) of ``Matreshka.Router`` can be created manually in case if you generate URL for further use. At this case changes of target properties don't affect on ``hash`` and don't call ``pushState``.

#### Properties

``Matreshka.Router`` instances has 3 properties.

- ``path`` - contains actual URL, eg ``/foo/bar/baz/``.
- ``hashPath`` - contains actual URL and hashbang as a prefix, eg ``#!/foo/bar/baz/``
- ``parts`` - contains an array of all parts of the path, eg ``[‘foo’, ‘bar’, ‘baz’]``.

All these properties are created using [calc](https://matreshka.io/#!Matreshka-calc), which means when you change one property, the others are changed automatically.

```js
Matreshka.Router.hash.path = '/foo/bar/baz/';
```

By changing these properties you can trigger needed procedures (update the path, change subscribed objects etc.)

#### Methods

- ``subscribe(object, route)`` - subscribes object for route changes.
- ``init()`` - used for lazy initialization in  ``subscribe`` method (no need to call it manually).

```js
const customRouter = new Matreshka.Router('myType');
const object = {
	a: 'foo',
	b: 'bar'
};

customRouter.subscribe(object, '/a/b/');

console.log(customRouter.path); // /foo/bar/
```
