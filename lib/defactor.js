(function( global ) {

// private map of all trigger/queue relations
var map = {},
	// private data store of all handlers
	data = {},
	toString = ({}).toString;

// utility function to clear out object queue
function clearQueue( obj ) {
	for ( var i in obj )
		if ( obj.hasOwnProperty( i ))
			obj[i] = [];
	return obj;
}

// utility function to generate a unique random id based on the passed object
function genUnique( obj ) {
	var key  = '';
	// loop through until a unique random key is found
	while (( key = ( Math.random() * 1e17 ).toString( 16 )) in obj );
	return key;
}

// utility function to check if something is an array
function isArray( arg ) {
	return toString.call( arg ) === '[object Array]';
}

// main Defactor object
function Defactor( clear ) {
	// make sure is a proper new instance
	if (!( this instanceof Defactor )) return new Defactor( clear );
	// create new unique random identifier, and ensure uniqueness
	this._key = genUnique( map );
	// relational map of all queues to resolvers
	map[ this._key ] = {};
	// set clear queue default for all defereds instantiated from the new object
	this._clear = clear === true ? true : false;
	return this;
}

Defactor.fn = Defactor.prototype = {
	// add a new trigger/queue set to the list
	add : function( trigger, queue ) {
		var tmap = map[ this._key ];
		// ensure trigger list has been initialized
		if ( !tmap[ queue ]) tmap[ queue ] = [];
		// add queue name to the list
		tmap[ queue ].push( trigger );
		return this;
	},

	// create and return new deferred object
	create : function() {
		var imap = map[ this._key ],
			_clear = this._clear,
			i, j;

		// uninstantiated deferred object
		function Inst( clear ) {
			// make sure is a proper new instance
			if (!( this instanceof Inst )) return new Inst( clear );
			// create new unique identifier, and ensure uniqueness
			this._guid = genUnique( data );
			// initialize trigger/queue data store for instance
			data[ this._guid ] = {};
			// should the queues be cleared after running
			this._clear = ( clear === true || clear === false ) ? clear : _clear;
			return this;
		}
		Inst.fn = Inst.prototype = {};

		// set a queue method
		function setQueue( queue ) {
			Inst.fn[ queue ] = function( fn ) {
				var tdata = data[ this._guid ],
					i = 0,
					tl;
				for ( i = 0; i < imap[ queue ].length; i++ ) {
					tl = imap[ queue ][i];
					// make sure queue list is initialized
					if ( !tdata[ tl ] ) tdata[ tl ] = [];
					// push function to the queue list
					tdata[ tl ].push( fn );
				}
				return this;
			};
		}

		// set a trigger method
		function setTrigger( trigger ) {
			Inst.fn[ trigger ] = function( ctx, args ) {
				var tdata = data[ this._guid ],
					i = 0;
				if ( isArray( ctx ) && !args ) {
					args = ctx;
					ctx = this;
				}
				// call all queues functions attached to trigger
				for ( i = 0; i < tdata[ trigger ].length; i++ ) (function( fn ) {
					setTimeout(function() {
						fn.apply( ctx, args );
					}, 0 );
				}( tdata[ trigger ][ i ]));
				// check if queues should be cleared
				if ( this._clear ) clearQueue( tdata );
				return this;
			};
		}

		// assign queues and triggers
		for ( i in imap ) {
			// check if queue method has already been set
			if ( !Inst.fn[ i ]) setQueue( i );
			for ( j = 0; j < imap[i].length; j++ )
				// check if trigger has already been set
				if ( !Inst.fn[ imap[i][j] ]) setTrigger( imap[i][j] );
		}

		// returns object with access to only queue methods
		Inst.fn.promise = function() {
			var newobj = {},
				i, j;
			for ( i in imap ) {
				newobj[i] = this[ i ];
			}
			newobj._clear = this._clear;
			newobj._guid = this._guid;
			return newobj;
		};

		// return instance to make chainable
		return Inst;
	}
};

global.defactor = Defactor;

}( this ));
