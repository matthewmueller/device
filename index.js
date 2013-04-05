/**
 * Module Dependencies
 */

var parse = require('user-agent-parser'),
    IO = require('io'),
    uid = require('uid'),
    qs = require('querystring');

/**
 * Expose `Device`
 */

module.exports = function(url) {
  Device.url = url;
  return Device;
};

/**
 * Initialize a `Device`
 *
 * var desktop = device('desktop')
 * var pitcher = device('pitcher', 'mobile');
 * var batter = device('batter', 'tablet');
 *
 * @param {String} name
 * @param {String} type
 * @param {Object} opts
 * @return {Device}
 * @api public
 */

function Device(name, type, opts) {
  if(!(this instanceof Device)) return new Device(name, type, opts);
  opts = opts || {};
  this.name = name;
  this.type = type || name;
  this.uid = this._uid();
  this.ua = this._ua();
  this.pathname = window.location.pathname;
}

/**
 * Get the device's user agent
 *
 * @return {String} ua
 * @api private
 */

Device.prototype._ua = function() {
  ua = parse(window.navigator.userAgent);
  return ua.device.type || 'desktop';
}

/**
 * Parse the url hash to provide a unique id
 *
 * @return {String} uid
 * @api private
 */

Device.prototype._uid = function() {
  var hash = window.location.hash;
  return (hash) ? hash.slice(1) : uid(4);
};

/**
 * Device is ready
 *
 * @param {Function} fn
 * @return {Device}
 * @api public
 */

Device.prototype.ready = function(fn) {
  if(this.type != this.ua) return this;

  // Add in query params
  var obj = qs.parse(window.location.search);
  obj.name = this.name;
  var q = qs.stringify(obj);

  // ws.mat.io:80/color-tilt/1z3a?name=pitcher
  var url = Device.url + '?' + q;
  var io = this.io = IO(url);

  // mixin io
  for(var key in io) this[key] = io[key];

  // call "ready" when socket is opened
  io.socket.on('open', function() {
    fn.call(this);
  });

  return this;
};
