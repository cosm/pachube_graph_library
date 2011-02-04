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
          var resource = data.resource;

          if (data.body != undefined) {
            try {
              self.websocket_callbacks[resource](evt);
            } catch(err) {}
          }
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
    , find_previous: ''
    };
    if (options.interval != undefined) { url.interval = '&interval=' + options.interval }
    if (options.start != undefined) { url.start = '&start=' + options.start.toISOString() }
    if (options.end != undefined) { url.end = '&end=' + options.end.toISOString() }
    if (options.per_page != undefined) { url.per_page = '&per_page=' + options.per_page }
    if (options.find_previous != undefined && options.find_previous == true) { url.find_previous = '&find_previous=' + options.find_previous }

    $.ajax({
      url: url.base + url.resource + url.format + url.key + url.interval + url.start + url.end + url.per_page + url.find_previous
    , success: options.callback
    , dataType: 'jsonp'
    });
  };

  // Attempts to use websockets to subscribe to a resource, then call the callback when data is received
  // Will fall back to polling at 5 minutes if it fails
  // Looks for:
  //  options.resource
  //  options.api_key or self.settings.api_key
  //  options.callback
  self.subscribe = function(options) {
    options.base = self.settings.api_url

    // Send the subscribe message
    try {
      self.websocket.send('{"method": "subscribe", "resource": "'+options.resource+'", "headers":{"X-PachubeApiKey":"'+(options.api_key || self.settings.api_key)+'"}');
      // Hook up the callback
      self.websocket_callbacks[options.resource] = options.callback;
    } catch(exception) {
      // Couldn't send
      // Maybe websockets aren't supported?
      console.log("Exception sending subscription: " + exception);

      // Fallback to polling every 5 minutes
      console.log("Falling back to polling");
      setInterval(self.datastreamGet(options), 300000);
    }
  };

  self.init();
}

var pachubeAPI = new PachubeAPI();
