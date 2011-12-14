var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var Defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'sometimes', 'done' )
	.add( 'reject', 'fail' )
	.always( 'exec' )
	.create();

var obj0 = new Defer( true ),
	obj0promise = obj0.promise();

obj0promise
	.done(function( a ) { log( 'obj0 : ' + a + ' : done' ); })
	.done(function() { log( this ); })
	.fail(function( a ) { log( 'obj0 : ' + a + ' : fail' ); })
	.exec(function( a ) { log( 'obj0 : ' + a + ' : always ' ); });

obj0.resolve([ 'resolve' ]).sometimes([ 'sometimes' ]).reject([ 'reject' ]);
log( '---------' );
obj0.resolve({ hi : 'me' }).resolve([ 'resolve' ]).resolve({ hi : 'me' },[ 'resolve' ]);
log( obj0 );
log( '---------' );
log( obj0promise );

return;
