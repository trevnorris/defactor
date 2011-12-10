var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var Defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'resolve', 'always' )
	.add( 'sometimes', 'done' )
	.addWith( 'resolveWith', 'done' )
	.create();


var obj0 = new Defer( true ),
	obj0promise = obj0.promise();

obj0promise.done(function( a ) { log( 'obj0 : ' + a + ' : done', this.hi ); })
	.always(function( a ) { log( 'obj0 : ' + a + ' : always' ); });

var obj1 = new Defer(),
	obj1promise = obj1.promise();

obj1promise.done(function( a ) { log( 'obj1 : ' + a + ' : done' ); })
	.always(function( a ) { log( 'obj1 : ' + a + ' : always' ); });


obj1.resolve([ 'resolve' ]).sometimes([ 'sometimes' ]);
log( '---------' );
obj0.resolve([ 'resolve' ]).sometimes([ 'sometimes' ]).resolveWith({ hi : 'With' }, ['resolveWith']);
log( '---------' );
log( obj0 instanceof Defer );
log( obj1 instanceof Defer );
log( '---------' );
log( obj0.promise());

return;
