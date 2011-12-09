(function( global ) {

// private data store of all done/fail handlers
var data = {},
	// private map of all triggers
	map = {},
	// utility function
	slice = [].slice;

// utility function to clear out deferred queue
function clearQueue( obj ) {
	for ( var i in obj )
		if ( obj.hasOwnProperty( i ))
			obj[i] = [];
	return obj;
}

// main Defactor object
function Defactor( persist ) {
	if (!( this instanceof Defactor )) return new Defactor( persist );
	// create new unique identifier, and ensure uniqueness
	while (( this._guid = ( Math.random() * 1e17 ).toString( 16 )) in data );
	// should the functions persist resolve/reject
	this._persist = persist ? true : false;
	// data stack of all resolver methods
	data[ this._guid ] = {};
	// relational map of all queues to resolvers
	map[ this._guid ] = {};
	return this;
}

Defactor.fn = Defactor.prototype = {
	// add a new queue/resolver set to the stack
	add : function( queue, resolver ) {
		var tmap = map[ this._guid ];
		// ensure resolver stack has been initialized
		if ( !tmap[ resolver ]) tmap[ resolver ] = [];
		// add queued function to the list
		tmap[ resolver ].push( queue );
		return this;
	},

	// create and return new deferred object
	create : function() {
		var _guid = this._guid,
			imap = map[ _guid ],
			inst = {},
			i;

		function assigner( queues, resolver ) {
			var i = 0;

			// set queue method
			function setQueue( queue ) {
				inst[ queue ] = function() {
					var tdata = data[ _guid ],
						args = slice.call( arguments ),
						i = 0;
					if ( !tdata[ queue ]) tdata[ queue ] = [];
					for (; i < args.length; i++ ) {
						tdata[ queue ].push( args[i] );
					}
					return this;
				};
			}

			// loop through and set all queue methods
			for (; i < queues.length; i++ )
				setQueue( queues[i] );

			// set resolver method
			inst[ resolver ] = function( args ) {
				var list = imap[ resolver ],
					tdata = data[ _guid ],
					i = 0,
					tl, j;
				// call all methods that are attached to the resolver
				for (; i < list.length; i++ ) {
					tl = tdata[ list[ i ]];
					if ( tl )
						for ( j = 0; j < tl.length; j++ )
							tl[j].apply( this, args );
				}
				if ( !this._persist )
					clearQueue( imap );
				return this;
			};
		}

		// assign all methods
		for ( i in imap ) assigner( imap[i], i );

		// pass other necessaries along
		inst._guid = _guid;
		inst._persist = this._persist;

		// return instance to make chainable
		return inst;
	}
};

global.defactor = Defactor;

}( this ));
