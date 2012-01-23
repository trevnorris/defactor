var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var Defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'sometimes', 'done' )
	.add( 'reject', 'fail' )
	.create();

var obj0 = new Defer( false ),
	obj0promise = obj0.promise();

obj0promise
	.done(function( a ) { log( 'obj0 : ' + a + ' : done' ); })
	.done(function( a ) { log( 'obj0 : ' + a + ' : ' + ( this.hi || "nothing here" )); })
	.fail(function( a ) { log( 'obj0 : ' + a + ' : fail' ); });

var obj1 = new Defer()
	.done(function() { log( 'obj1 : done' ); })
	.fail(function() { log( 'obj1 : fail' ); });

obj1.resolve()
	.reject();
obj0.resolve([ 'resolve' ])
	.sometimes([ 'sometimes' ])
	.reject([ 'reject' ]);
obj0.resolve({ hi : 'me' })
	.resolve([ 'resolve' ])
	.resolve({ hi : 'me' },[ 'resolve' ]);

return;
