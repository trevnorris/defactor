var defactor = require( '../lib/defactor.js' ).defactor
	log = console.log;

var defer = defactor( true )
	.add( 'done', 'resolve' )
	.add( 'done', 'always' )
	.add( 'happy', 'resolve' )
	.create();

defer.done(function() { log( 'done0' ); })
	.done(function() { log( 'done1' ); })
	.happy(function() { log( 'happy0' ); })
	.resolve()
	.always();
