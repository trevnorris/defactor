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
	// create new unique random identifier, and ensure uniqueness
	while (( this._key = ( Math.random() * 1e17 ).toString( 16 )) in map );
	// relational map of all queues to resolvers
	map[ this._key ] = {
		add : {},     // simple trigger/queue pairs
		addWith : {}, // trigger/queue pairs where resolver can be given new context
		always : []   // queues that will always trigger
	};
	return this;
}

Defactor.fn = Defactor.prototype = {
	// add a new trigger/queue set to the stack
	add : function( trigger, queue ) {
		var tmap = map[ this._key ].add;
		// ensure trigger stack has been initialized
		if ( !tmap[ trigger ]) tmap[ trigger ] = [];
		// add queued function to the list
		tmap[ trigger ].push( queue );
		return this;
	},

	// add new trigger/queue to stack where trigger accepts new context
	addWith : function( trigger, queue ) {
		var tmap = map[ this._key ].addWith;
		// ensure trigger stack has been initialized
		if ( !tmap[ trigger ]) tmap[ trigger ] = [];
		// add queued function to the list
		tmap[ trigger ].push( queue );
		return this;
	},

	// add queue that will always trigger
	addAlways : function( queue ) {
		map[ this._key ].always.push( queue );
		return this;
	},

	// create and return new deferred object
	create : function() {
		var imap = map[ this._key ],
			i, j, k;

		// uninstantiated deferred object
		function inst( persist ) {
			if (!( this instanceof inst )) return new inst( persist );
			// create new unique identifier, and ensure uniqueness
			while (( this._guid = ( Math.random() * 1e17 ).toString( 16 )) in data );
			// initialize trigger/queue data store for instance
			data[ this._guid ] = {
				// methods that will always run
				_always : imap.always
			};
			// should the functions persist resolution
			this._persist = persist ? true : false;
			return this;
		}
		inst.fn = inst.prototype = {};

		// assign all queues; except 'always'
		for ( i in imap )
			if ( i !== 'always' )
				for ( j in imap[i] )
					for ( k = 0; k < imap[i][j].length; k++ )
						if ( !inst.fn[ imap[i][j][k] ])
							setQueue( imap[i][j][k] );

		// assign all 'always' queues
		for ( i = 0; i < imap.always.length; i++ )
			setQueue( imap.always[i] );

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

		// set add() triggers
		for ( i in imap.add )
				assignTriggers( i );

		function assignTriggers( trigger ) {
			inst.fn[ trigger ] = function( args ) {
				runTriggers( imap.add[ trigger ], data[ this._guid ], this, args, this._persist );
				return this;
			};
		}

		// set addWith() triggers
		for ( i in imap.addWith )
				assignTriggersWith( i );

		function assignTriggersWith( trigger ) {
			inst.fn[ trigger ] = function( ctx, args ) {
				runTriggers( imap.addWith[ trigger ], data[ this._guid ], ctx, args, this._persist );
				return this;
			};
		}

		// generic trigger executor
		function runTriggers( list, tdata, ctx, args, persist ) {
			var i = 0,
				tl, j, k;
			// fire the 'always' methods
			for (; i < tdata._always.length; i++ ) {
				tl = tdata._always[i];
				for ( j in tdata[tl] ) {
					for ( k = 0; k < tdata[tl].length; k++ ) {
						tdata[tl][k].apply( ctx, args );
					}
				}
			}
			// call all methods attached to trigger
			for ( i = 0; i < list.length; i++ ) {
				tl = tdata[ list[ i ]];
				if ( tl )
					for ( j = 0; j < tl.length; j++ )
						tl[j].apply( ctx, args );
			}
			if ( !persist ) clearQueue( tdata );
		}

		// returns object with access to only queue methods
		inst.fn.promise = function() {
			var newobj = {},
				accum, queue, i, j, k;
			for ( i in imap ) {
				accum = imap[i];
				if ( i !== 'always' ) {
					for ( j in accum ) {
						queue = accum[j];
						for ( k = 0; k < queue.length; k++ )
							newobj[ queue[k]] = inst.fn[ queue[k]];
					}
				} else {
					for ( j = 0; j < accum.length; j++ ) {
						newobj[ accum[j] ] = inst.fn[ accum[j]];
					}
				}
			}
			newobj._persist = this._persist;
			newobj._guid = this._guid;
			return newobj;
		};

		// return instance to make chainable
		return inst;
	}
};

global.defactor = Defactor;

}( this ));
