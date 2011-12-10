(function( global ) {

// private map of all trigger/queue relations
var map = {},
	// private data store of all handlers
	data = {},
	// utility function
	slice = [].slice;

// utility function to clear out object queue
function clearQueue( obj ) {
	for ( var i in obj )
		if ( obj.hasOwnProperty( i ))
			obj[i] = [];
	return obj;
}

// main Defactor object
function Defactor() {
	if (!( this instanceof Defactor )) return new Defactor();
	// create new unique identifier, and ensure uniqueness
	while (( this._key = ( Math.random() * 1e17 ).toString( 16 )) in map );
	// relational map of all queues to resolvers
	map[ this._key ] = {};
	return this;
}

Defactor.fn = Defactor.prototype = {
	// add a new trigger/queue set to the stack
	add : function( trigger, queue ) {
		var tmap = map[ this._key ];
		// ensure trigger stack has been initialized
		if ( !tmap[ trigger ]) tmap[ trigger ] = [];
		// add queued function to the list
		tmap[ trigger ].push( queue );
		return this;
	},

	// create and return new deferred object
	create : function() {
		var imap = map[ this._key ],
			i;

		// uninstantiated deferred object
		function inst( persist ) {
			if (!( this instanceof inst )) return new inst( persist );
			// create new unique identifier, and ensure uniqueness
			while (( this._guid = ( Math.random() * 1e17 ).toString( 16 )) in data );
			// initialize trigger/queue data store for instance
			data[ this._guid ] = {};
			// should the functions persist resolution
			this._persist = persist ? true : false;
			return this;
		}
		inst.fn = inst.prototype = {};

		// set queue methods
		function assignQueues( trigger, queues ) {
			var i = 0;

			// set a single queue method to the instance prototype
			function setQueue( queue ) {
				inst.fn[ queue ] = function() {
					var tdata = data[ this._guid ],
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
				if ( !inst.fn[ queues[i]])
					setQueue( queues[i] );

			// set trigger method
			inst.fn[ trigger ] = function( args ) {
				var list = imap[ trigger ],
					tdata = data[ this._guid ],
					i = 0,
					tl, j;
				// call all methods that are attached to the trigger
				for (; i < list.length; i++ ) {
					tl = tdata[ list[ i ]];
					if ( tl )
						for ( j = 0; j < tl.length; j++ )
							tl[j].apply( this, args );
				}
				if ( !this._persist )
					clearQueue( tdata );
				return this;
			};
		}

		// assign all methods
		for ( i in imap ) assignQueues( i, imap[i] );

		// return instance to make chainable
		return inst;
	}
};

global.defactor = Defactor;

}( this ));
