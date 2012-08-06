var defactor = require( '../lib/defactor.js' ),
	log = console.log;


var Defer = defactor({
		'resolve' : 'done always',
		'sometimes' : 'done always',
		'reject' : 'fail always'
	});
	//.add( 'resolve', 'done always' )
	//.add( 'sometimes', 'done always' )
	//.add( 'reject', 'fail always' )
	//.create();

var obj0 = new Defer(),
	obj0promise = obj0.promise();

obj0promise
	.done(function( a ) { log( 'obj0 : ' + a + ' : ' + ( this.hi || "nothing here" )); })
	.fail(function( a ) { log( 'obj0 : ' + a + ' : fail' ); })
	.always(function() { log( 'obj0 : always' ); });

var obj1 = new Defer( true )
	.done(function() { log( 'obj1 : done' ); })
	.fail(function() { log( 'obj1 : fail' ); })
	.always(function() { log( 'obj1 : always' ); });

obj1.resolve()
	.reject();
obj0.resolve([ 'resolve' ])
	.sometimes([ 'sometimes' ])
	.reject([ 'reject' ]);
obj0.resolve({ hi : 'me' })
	.resolve([ 'resolve' ])
	.resolve({ hi : 'me' },[ 'resolve' ]);

return;
