
/**
 * @augments JsSIP
 * @class Class creating a Name Address SIP header.
 *
 * @param {JsSIP.URI} uri
 * @param {String} [display_name]
 * @param {Object} [parameters]
 *
 */
JsSIP.NameAddrHeader = function(uri, display_name, parameters) {
  var param;

  // Checks
  if(!uri || !(uri instanceof JsSIP.URI)) {
    throw new TypeError('missing or invalid "uri" parameter');
  }

  // Initialize parameters
  this.uri = uri;
  this.parameters = {};

  for (param in parameters) {
    this.setParam(param, parameters[param]);
  }

  Object.defineProperties(this, {
    display_name: {
      get: function() { return display_name; },
      set: function(value) {
        display_name = (value === 0) ? '0' : value;
      }
    }
  });
};
JsSIP.NameAddrHeader.prototype = {
  setParam: function(key, value) {
    if (key) {
      this.parameters[key.toLowerCase()] = (typeof value === 'undefined' || value === null) ? null : value.toString().toLowerCase();
    }
  },

  getParam: function(key) {
    if(key) {
      return this.parameters[key.toLowerCase()];
    }
  },

  hasParam: function(key) {
    if(key) {
      return (this.parameters.hasOwnProperty(key.toLowerCase()) && true) || false;
    }
  },

  deleteParam: function(parameter) {
    var value;
    parameter = parameter.toLowerCase();
    if (this.parameters.hasOwnProperty(parameter)) {
      value = this.parameters[parameter];
      delete this.parameters[parameter];
      return value;
    }
  },

  clearParams: function() {
    this.parameters = {};
  },

  clone: function() {
    return new JsSIP.NameAddrHeader(
      this.uri.clone(),
      this.display_name,
      window.JSON.parse(window.JSON.stringify(this.parameters)));
  },

  toString: function() {
    var body, parameter;

    body  = (this.display_name || this.display_name === 0) ? '"' + this.display_name + '" ' : '';
    body += '<' + this.uri.toString() + '>';

    for (parameter in this.parameters) {
      body += ';' + parameter;
      body += (this.parameters[parameter] === null) ? '' : '=' + this.parameters[parameter];
    }

    return body;
  }
};


/**
  * Parse the given string and returns a JsSIP.NameAddrHeader instance or undefined if
  * it is an invalid NameAddrHeader.
  * @public
  * @param {String} name_addr_header
  */
JsSIP.NameAddrHeader.parse = function(name_addr_header) {
  name_addr_header = JsSIP.Grammar.parse(name_addr_header,'Name_Addr_Header');

  if (name_addr_header !== -1) {
    return name_addr_header;
  } else {
    return undefined;
  }
};