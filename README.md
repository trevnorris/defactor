# Defactor - A Deferred Factory Object

Defactor allows creating deferred objects with a many-to-many relationship between queues and triggers.
By creating this type of event map there shouldn't be a need for callback insanity.
The idea is to create new deferreds for different call types, then return new instances.
By doing this the end user's API can be fully chained.
Here's an example:

```javascript
// generate a new deferred object with custom event triggers and function queues
var defer = defactor()
    .add( 'resolve', 'done' )
    .add( 'reject', 'fail' )
    .addAlways( 'always' )
    .create();

// create an instance of the new deferred
var myDef = new defer();  // or just `defer()`

// queue up functions to complete
myDef.done(function() {
        console.log( 'done' );
    })
    .fail(function() {
        console.log( 'fail' );
    })
    .always(function() {
        console.log( 'always' );
    });

myDef.resolve();    // LOG: "done"; "always"
```

## Features

* `add()`: adds a new trigger/queue to the stack

* `always()`: add queue that will always be fired, and fired first

* Queues can be passed context and/or an array of arguments

* All generated deferreds have a `promise()` method that will return a promise object

* Events will persist after triggered if `true` is passed when instantiating the deferred

## Roadmap

* (v0.1.1) Make queue execution non-blocking

* (v0.1.2) Set default queue persistance by passing `true`/`false` to `defactor()`

* (v0.1.3) Add `progress( fn )` method to deferreds. Will execute fn when any object instantiated from the deferred triggers.

* (v0.2.0) The final argument to `add()` or `always()` can be a function, which will execute when called and pass any arguments. Example:

```javascript
var onEvent = defactor()
    .add( 'debug', 'trigger' )
    .always( 'ajax', function( opts ) {  // make an ajax call
        var ctx = this,
            call = $.ajax( opts );
        call.end = function() {
            return ctx;
        };
        return call;
    });

var e = new onEvent( true )
    // ajax returns a new deferred context
    .ajax({
        // options
    })
        .success( fn )  // if call succeeds
        .fail( fn )     // if call fails
        .end()          // return to previous context
    .debug(function() {
        // log some stuff
    });

e.trigger();
```

## Known Issues

* If a deferred is created with only `always()` queues, then there is no way to trigger them.
