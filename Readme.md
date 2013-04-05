
# device

  Higher-level API built on matthewmueller/io built for separating out socket logic and sending messages between clients.

## Installation

    $ component install matthewmueller/device

## Example

```js
var device = require('device')('http://socketserver.com');

var batter = device('batter').type('mobile');
var pitcher = device('pitcher').type('mobile');
var field = device('field').type('desktop');

batter.ready(function() {
  batter.send('field', 'homerun');
});

pitcher.ready(function() {
  pitcher.emit('throw');
});

field.ready(fn);
```

## API

### `require('device')(url)`

Initialize the devices with the given `url`. This is the url that gets passed into `matthewmueller/io` and ultimately into `learnboost/engine.io`.

### `Device(name)`

Initialize a `Device` with a given `name`. This name should uniquely identify the device from the rest of the devices in the room.

### `.type(mobile|desktop|tablet)`

Target a specific device. Maybe you want the desktop to be the view for input from your phone.

### `.ready(fn)`

Initializes the socket and calls `fn` when done. This library uses socket pooling in order for each connected client to call at most one `ready` function.

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
