var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var Defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'sometimes', 'done' )
	.add( 'reject', 'fail' )
	.create();

var obj0 = new Defer( true ),
	obj0promise = obj0.promise();

obj0promise
	.done(function( a ) { log( 'obj0 : ' + a + ' : done' ); })
	.done(function() { log( 'done again' ); })
	.fail(function( a ) { log( 'obj0 : ' + a + ' : fail' ); });

var obj1 = new Defer(),
	obj1promise = obj1.promise();

obj1promise
	.done(function( a ) { log( 'obj1 : ' + a + ' : done' ); })
	.done(function() { log( 'done again' ); })
	.fail(function( a ) { log( 'obj1 : ' + a + ' : fail' ); });


obj1.resolve([ 'resolve' ]).sometimes([ 'sometimes' ]).reject([ 'reject' ]);
log( '---------' );
obj0.resolve([ 'resolve' ]).sometimes([ 'sometimes' ]).reject([ 'reject' ]);
log( '---------' );
log( obj0 );
log( '---------' );
log( obj0promise );

return;
