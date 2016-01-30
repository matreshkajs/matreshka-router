describe('HTML5 History routing', () => {
	var obj = {
		a: 'foo'
	},
	router;

	beforeAll(() => {
		router = new MK.Router('history').subscribe(obj, 'a/b/c/d');
	})

	it('initializes correctly', done => {
		expect(obj.a).toEqual('foo');
		expect(obj.b).toEqual(null);
		expect(obj.c).toEqual(null);
		expect(obj.d).toEqual(null);

		setTimeout(() => {
			expect(document.location.pathname).toEqual(`/foo/`);
			done();
		}, 50);
	});

	it('changes properties when URL (pathname) is changed', done => {
		router.url = '/bar/baz/qux/';

		setTimeout(() => {
			expect(obj.a).toEqual('bar');
			expect(obj.b).toEqual('baz');
			expect(obj.c).toEqual('qux');
			expect(obj.d).toEqual(null);
			done();
		}, 50);
	});

	it('changes URL (pathname) when property is changed', done => {
		obj.b = 'lol';
		setTimeout(() => {
			expect(document.location.pathname).toEqual('/bar/lol/qux/');
			done();
		}, 50);
	});
});
