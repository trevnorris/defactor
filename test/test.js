var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;


var defer = defactor( true )
	.add( 'resolve', 'done' )
	.add( 'reject', 'fail' )
	.create();


var obj = (new defer());

obj.done(function() { log( 'done' ); })
	.fail(function() { log( 'fail' ); });

var obj0 = (new defer( true ));

obj0.done(function() { log( 'what?' ); })
	.fail(function() { log( 'huh?' ); });

obj0.reject().resolve();
log( '---------' );
obj.resolve().reject();
log( '---------' );
log( obj instanceof defer );

return;
