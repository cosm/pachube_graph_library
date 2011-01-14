function PachubeAPI(options) {
  // Magic Incantation to enforce instantiation
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function() {
    self.settings = {};
    if (options != undefined) {
      self.settings = {
        api_key: options.api_key
      };
    }
    self.settings.api_url = 'http://api.pachube.com/v2/';

    self.setupWebSocket();
  }

  // Setup websocket client if it is supported
  self.setupWebSocket = function() {
    try {
      if ("WebSocket" in window) {
        // It is supported
        self.websocket_callbacks = {};

        // Initialize the websocket connection
        var ws = new WebSocket("ws://beta.pachube.com:8080/");
        // When we get a message send it to the right handler
        ws.onmessage = function(evt) {
          var data = JSON.parse(evt.data);
          var resource = "";
          if (data.ds_id) {
            resource = "/datastreams/" + data.ds_id;
          }
          resource = "/feeds/" + data.feed_id + resource;

          self.websocket_callbacks[resource](evt);
        };
        self.websocket = ws;
      }
    } catch(exception) {
      console.log("Exception connecting to websocket: " + exception);
    }
  }

  self.datastreamGet = function(options) {
    var url = {
      base: self.settings.api_url
    , resource: options.resource
    , format: '.json'
    , key: '?key=' + (options.api_key || self.settings.api_key)
    , interval: ''
    , start: ''
    , end: ''
    , per_page: ''
    };
    if (options.interval != undefined) { url.interval = '&interval=' + options.interval }
    if (options.start != undefined) { url.start = '&start=' + options.start.toISOString() }
    if (options.end != undefined) { url.end = '&end=' + options.end.toISOString() }
    if (options.per_page != undefined) { url.per_page = '&per_page=' + options.per_page }

    $.ajax({
      url: url.base + url.resource + url.format + url.key + url.interval + url.start + url.end + url.per_page
    , success: options.callback
    , dataType: 'jsonp'
    });
  };

  // Attempts to use websockets to subscribe to a resource, then call the callback when data is received
  // Looks for:
  //  options.resource
  //  options.api_key or self.settings.api_key
  //  options.callback
  self.subscribe = function(options) {
    options.base = self.settings.api_url

    // Check if websockets are supported in this browser
    if (self.websocket != undefined) {
      // They are supported

      // Hook up the callback
      if (options.callback != undefined) {
        self.websocket_callbacks[options.resource] = options.callback
      }

      // Send the subscribe message
      try {
      self.websocket.send('{"command": "subscribe", "resource": "'+options.resource+'", "api_key": "'+(options.api_key || self.settings.api_key)+'"}');
      } catch(exception) {
        console.log("Exception sending subscription: " + exception);
      }
    } else {
      // They are not supported
      // Fallback to polling every 5 minutes
      setInterval(self.datastreamGet(options), 300000);
    }
  };

  self.init();
}

var pachubeAPI = new PachubeAPI();
