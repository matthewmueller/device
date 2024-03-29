
# device

  Higher-level API built on [matthewmueller/io](http://github.com/matthewmueller/io) for separating out socket logic and identifying clients, so messages can be passed between them.

## Installation

    $ component install matthewmueller/device

## Example

```js
var device = require('device')('http://socketserver.com');

var batter = device('batter').type('mobile');
var pitcher = device('pitcher').type('mobile');
var field = device('field').type('desktop');

batter.ready(function() {
  batter.on('throw', hitHomerun);
});

pitcher.ready(function() {
  pitcher.emit('throw');
});

field.ready(fn);
```

## API

### `require('device')(url)`

Initialize the devices with the given `url`. This is the url that gets passed into `matthewmueller/io` and ultimately into `learnboost/engine.io`.

### `device(name, type)`

Initialize a `device` with a given `name`. This name should uniquely identify the device from the rest of the devices in the room. `type` can be "mobile", "desktop", or "tablet";

### `.ready(fn)`

Initializes the socket and calls `fn` when done. This library uses socket pooling in order for each connected client to call at most one `ready` function.

Ready can be called multiple times with multiple functions `fn`.

```js
iphone.ready(doThis);
iphone.ready(doThat);
```

## Socket Server

There are some assumptions made about the configuration of the socket server. Head over to [matthewmueller/ws.mat.io](http://github.com/matthewmueller/ws.mat.io) to see the server-side component.

## Test

You'll need to edit the `test.html` to point to your socket server's address. Then do:

```
make
serve &
open http://localhost:3000
```

## License

  MIT
