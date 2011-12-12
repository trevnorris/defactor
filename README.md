# Defactor - A Deferred Factory Object

Defactor allows creating deferred objects with a many-to-many relationship between queues and triggers.
By creating this type of event map there shouldn't be a need for callback insanity.
Here's an example:

```javascript
// generate a new deferred object with custom event triggers and function queues
var defer = defactor()
    .add( 'resolve', 'done' )
    .add( 'reject', 'fail' )
    .addWith( 'resolveWith', 'done' )
    .addWith( 'rejectWith', 'fail' )
    .addAlways( 'always' )
    .create();

// create an instance of the new deferred
var myDef0 = new defer();  // or just `defer()`

// queue up functions to complete
myDef0.done(function() {
        console.log( 'done' );
    })
    .fail(function() {
        console.log( 'fail' );
    })
    .always(function() {
        console.log( 'always' );
    });

myDef0.resolve();    // LOG: "done"; "always"
```

The idea is to create new deferreds for different call types, then return new instances.
By doing this the end user's API can be fully chained.
Here's an example of what jQuery's `on` method could look like:

```javascript
$( '.selector' )
    .on( 'click' )            // return a new deferred
        .exec( fn )           // execute the function once complete
        .ajax( {} )           // make an AJAX call, which will also return a new deferred
            .success( fn )    // in case of success
            .fail( fn )       // in case of failure
            .completed( fn )  // always
            .end()            // return to previous context
        .animate( {} )        // animate the clicked element
            .exec( fn )       // execute the function once animation is complete
```

## Features

* `add()`: adds a new trigger/queue to the stack

* `addWith()`: add new trigger/queue, where trigger expects a context arguments

* `addAlways()`: add queue that will always be fired, and fired first

* All generated deferreds have a `promise()` method that will return a promise object
