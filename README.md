# Defactor - A Deferred Factory Object

Defactor allows creating deferred objects with a many-to-many relationship between queues and triggers.
By creating this type of event map there shouldn't be a need for callback insanity.
The idea is to create new deferreds for different call types, then return new instances.
By doing this the end user's API can be fully chained.
Here's an example:

```javascript
// generate a new deferred object with custom event triggers and function queues
var defer = defactor()
    .add( 'resolve', 'done always' )
    .add( 'reject', 'fail always' )
    .create();

// OR use the alternate syntax by passing an object
// (note: this will add all triggers/queues then create() when complete)
var defer = defactor({
    resolve : 'done always',
    reject : 'fail always'
});

// create an instance of the new deferred
var myDef = new defer();  // or just `defer()`

// queue up functions to complete
myDef.done(function( arg ) {
        console.log( 'done:' + arg + ':' + this.ctx );
    })
    .fail(function() {
        console.log( 'fail' );
    })
    .always(function() {
        console.log( 'always' );
    });

myDef.resolve( 'now', {
    ctx : 'here'
});    // LOG: "done:now:here"; "always"
```

## Features/API

* `defactor( [clear],[map] )`: initialize new defactor object. If `clear === true` then default behavior is to clear queue after trigger. `map` will accept an object of triggers : queues then create the deferred automatically.

* `.add( trigger, queue )`: adds a new trigger/queue to the stack. `queue` can be a space separated string, or an array.

* `.create()`: generates new deferred from the defactor object.

* Queues can be passed context and/or an array of arguments

* All generated deferreds have a `promise()` method that will return a promise object

* Events will be cleared after triggering if `true` is passed when instantiating the deferred

## Roadmap

* (v0.2.0) The final argument to `add()` can be a function, which will execute when called and pass any arguments. Example:

```javascript
var onEvent = defactor()
    .add( 'trigger', 'debug' )
    .add( 'trigger', 'ajax', function( opts ) {  // make an ajax call
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
* (v0.3.0) Asynchronous queue manager so functions in queues are non-blocking, but are still executed in order; and chaining will also be executed in order.
