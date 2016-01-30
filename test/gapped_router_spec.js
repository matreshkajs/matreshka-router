describe('Gapped router (API test)', function() {
	var obj = {
		a: 'foo',
		b: 'bar',
		c: 'baz'
	},
	router = new MK.Router(null).subscribe(obj, 'a/*/c/*/e/f');

	it('initializes correctly', () => {
		expect(obj.a).toEqual('foo');
		expect(obj.b).toEqual('bar');
		expect(obj.c).toEqual(null); // because 2nd part is not set
		expect(obj.d).toEqual(undefined);
		expect(obj.e).toEqual(null);
		expect(obj.f).toEqual(null);
	});

	it('changes properties when URL is changed', () => {
		router.url = '/bar/baz/qux/eggs/bat/lol/';

		expect(obj.a).toEqual('bar');
		expect(obj.b).toEqual('bar');
		expect(obj.c).toEqual('qux');
		expect(obj.d).toEqual(undefined);
		expect(obj.e).toEqual('bat');
		expect(obj.f).toEqual('lol');
	});

	it('changes URL when property is changed', () => {
		obj.c = 'poo';
		expect(router.url).toEqual('/bar/baz/poo/eggs/bat/lol/');
		expect(router.hashBang).toEqual('#!/bar/baz/poo/eggs/bat/lol/');
	});

	it('sets further parts as null if one of parts is null', () => {
		obj.c = null;

		expect(obj.a).toEqual('bar');
		expect(obj.b).toEqual('bar');
		expect(obj.c).toEqual(null);
		expect(obj.d).toEqual(undefined);
		expect(obj.e).toEqual(null);
		expect(obj.f).toEqual(null);
	});
});
