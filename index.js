/**
 * Module Dependencies
 */

var parse = require('user-agent-parser'),
    IO = require('io'),
    uid = require('uid'),
    qs = require('querystring');

/**
 * List of devices
 */

var devices = [];

/**
 * Are we trying to open a connection?
 */

var opening = false;

/**
 * Have we connected to something?
 */

var connected = false;

/**
 * Window hash
 */

var hash = window.location.hash;

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
 * var pitcher = device('pitcher');
 * var batter = device('batter');
 *
 * @param {String} name
 * @param {Object} opts
 * @return {Device}
 * @api public
 */

function Device(name, type, opts) {
  if(!(this instanceof Device)) return new Device(name, type, opts);
  opts = opts || {};
  this.name = name;
  this.master = !hash;
  this.readied = false;
  this.type = type;
  this.pathname = window.location.pathname;
  this.url = this._url();
  this.fns = [];

  // add to all devices
  // devices.push({ type : type, name : name });
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
 * Create the url
 *
 * @return {String} url
 * @api private
 */

Device.prototype._url = function() {
  // Add in query params
  var obj = qs.parse(window.location.search);
  obj.name = this.name;
  var q = qs.stringify(obj);
  return Device.url + '?' + q;
};

/**
 * Device is ready
 *
 * @param {Function} fn
 * @return {Device}
 * @api public
 */

Device.prototype.ready = function(fn) {
  this.fns.push(fn);

  // If called already, just return
  if(this.readied) return;

  // if the user agent doesnt match the type or we're already connected
  // don't go any further
  if(this.type && this.type != this._ua() || connected) return this;

  devices.push(this);

  // try to open socket connection
  this.open();

  this.readied = true;
  return this;
};

/**
 * Try to open with an identity (name).
 * Open a connection one at a time.
 * If the identity is already taken,
 * try the next one.
 *
 * @param {Function} fn
 * @return {Device}
 * @api private
 */

Device.prototype.open = function() {
  if(opening || connected) return this;
  opening = true;
  var self = this;
  var device = devices.shift();

  if(!device) return this;
  var io = IO(device.url);

  io.socket.on('open', function() {

    // identity acknowledged by socket server
    io.on('ack', function() {
      // mixin io
      for(var key in io) device[key] = io[key];
      opening = false;
      connected = true;

      for (var i = 0, len = device.fns.length; i < len; i++) {
        device.fns[i].call(device);
      }
    });

    // identity not acknowledged, try another
    // identity if there is one
    io.on('nak', function() {
      opening = false;
      self.open();

      // this is a HACK to prevent errors
      // slowly close down socket, after
      // enough time has passed for all the
      // engine.io socketry to be made.
      setTimeout(function() {
        io.socket.close();
      }, 2000);
    });

  });

  return this;
};

