var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var Defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'resolve', 'always' )
	.add( 'reject', 'fail' )
	.add( 'reject', 'always' )
	.add( 'sometimes', 'done' )
	.create();


var obj0 = new Defer( true );

obj0.done(function( a ) { log( 'obj0 : ' + a + ' : done' ); })
	.fail(function( a ) { log( 'obj0 : ' + a + ' : fail' ); })
	.always(function( a ) { log( 'obj0 : ' + a + ' : always' ); });

var obj1 = new Defer();

obj1.done(function( a ) { log( 'obj1 : ' + a + ' : done' ); })
	.fail(function( a ) { log( 'obj1 : ' + a + ' : fail' ); })
	.always(function( a ) { log( 'obj1 : ' + a + ' : always' ); });


obj1.reject([ 'reject' ]).resolve([ 'resolve' ]).sometimes([ 'sometimes' ]);
log( '---------' );
obj0.resolve([ 'resolve' ]).reject([ 'reject' ]).sometimes([ 'sometimes' ]);
log( '---------' );
log( obj0 instanceof Defer );

return;
