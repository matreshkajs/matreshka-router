describe('Simple router (API test)', function() {
	var obj = {
		a: 'foo'
	},
	router = new MK.Router(null).subscribe(obj, 'a/b/c/d');


	it('initializes correctly', () => {
		expect(obj.a).toEqual('foo');
		expect(obj.b).toEqual(null);
		expect(obj.c).toEqual(null);
		expect(obj.d).toEqual(null);
	});

	it('changes properties when URL is changed', () => {
		router.url = '/bar/baz/qux/';

		expect(obj.a).toEqual('bar');
		expect(obj.b).toEqual('baz');
		expect(obj.c).toEqual('qux');
		expect(obj.d).toEqual(null);
	});

	it('changes URL when property is changed', () => {
		obj.b = 'lol';
		expect(router.url).toEqual('/bar/lol/qux/');
		expect(router.hashBang).toEqual('#!/bar/lol/qux/');
	});

	it('sets further parts as null if one of parts is null', () => {
		obj.b = null;

		expect(obj.a).toEqual('bar');
		expect(obj.b).toEqual(null);
		expect(obj.c).toEqual(null);
		expect(obj.d).toEqual(null);
	});
});
