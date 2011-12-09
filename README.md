# Defector - A Deferred Factory Object

Defector allows creating deferred objects with a many-to-many relationship between queues and resolvers.
By creating this type of event map there shouldn't be a need for callback insanity.
Here's an example:

```javascript
var dobj = defactor();

dobj.add( 'done', 'resolve' )
	.add( 'fail', 'reject' )
	.add( 'always', 'resolve' )
	.add( 'always', 'reject' );

var defer = dobj.create();

defer.done(function() {
		console.log( 'done' );
	})
	.fail(function() {
		console.log( 'fail' );
	})
	.always(function() {
		console.log( 'always' );
	});

defer.resolve();    // LOG: "done"; "always"
```

## Roadmap:

* add the `promise()` method to each deferred
* allow `addWith()` to create queue/resolver pairs that accept a new context
* `create()` should return an uninstantiated deferred
* add `always()` method to create a queue that is always fired
* add `then()` that accepts two queues and resolvers

