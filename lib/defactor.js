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

// utility function to check if arg is an array
function isArray( arg ) {
	return toString.call( arg ) === '[object Array]';
}

// utility function to check if arg is an object
function isObject( arg ) {
	return toString.call( arg ) === '[object Object]';
}

// utility function to build out a defactor instance from an object
function buildDef( inst, obj ) {
	var i;
	for ( i in obj )
		inst.add( i, obj[i] );
	return inst.create();
}

// main Defactor object
function Defactor( clear, obj ) {
	// make sure is a proper new instance
	if (!( this instanceof Defactor )) return new Defactor( clear, obj );
	// create new unique random identifier, and ensure uniqueness
	this._key = genUnique( map );
	// relational map of all queues to resolvers
	map[ this._key ] = {};
	// set clear queue default for all defereds instantiated from the new object
	this._clear = clear === true ? true : false;
	// check if object is passed, and if should build object on the spot
	return isObject( clear ) ?
		buildDef( this, clear )
	: isObject( obj ) ?
		buildDef( this, obj )
	: this;
}

Defactor.fn = Defactor.prototype = {
	// add a new trigger/queue set to the list
	// queue may be a string, space seperated, or an array
	add : function( trigger, queue ) {
		var tmap = map[ this._key ],
			i = 0,
			qtmp;
		// check if the queue is an array or string
		if ( !isArray( queue )) queue = queue.split( ' ' );
		// loop through all queues in array
		for (; i < queue.length; i++ ) {
			qtmp = queue[i];
			// ensure trigger list has been initialized
			if ( !tmap[ qtmp ]) tmap[ qtmp ] = [];
			// add queue name to the list
			tmap[ qtmp ].push( trigger );
		}
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
				for ( i = 0; i < tdata[ trigger ].length; i++ ) {
					tdata[ trigger ][ i ].apply( ctx, args );
				}
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

if (typeof module === 'object' && module.exports) module.exports = Defactor
else global.defactor = Defactor;

}( this ));
