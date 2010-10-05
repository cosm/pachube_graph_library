function PachubeAPI(options) {
  // Magic Incantation to enforce instantiation
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.settings = {};
  if (options != undefined) {
    self.settings = {
      api_key: options.api_key
    };
  }
  self.settings.api_url = 'http://api.pachube.com/v2/';

}

PachubeAPI.prototype.datastreamGet = function(options) {
  var self = this;

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

var pachubeAPI = new PachubeAPI();
