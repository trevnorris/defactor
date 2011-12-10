# Defector - A Deferred Factory Object

Defector allows creating deferred objects with a many-to-many relationship between queues and triggers.
By creating this type of event map there shouldn't be a need for callback insanity.
Here's an example:

```javascript
// generate a new deferred object with custom event triggers and function queues
var defer = defactor().add( 'resolve', 'done' )
	.add( 'reject', 'fail' )
	.add( 'resolve', 'always' )
	.add( 'reject', 'always' )
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

## Roadmap:

* allow `addWith()` to create queue/resolver pairs that accept a new context
* add `always()` method to create a queue that is always fired
* add `then()` that accepts two queues and resolvers

