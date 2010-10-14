function PachubeGraph(element) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  self.init = function(element) {
    if (element != undefined) {
      self.element = element;
    }

    self.settings = {
      resource: self.element.attr('pachube-resource')
    , api_key: self.element.attr('pachube-key')
    , per_page: 2000
    , polling_interval: 300000 // 5 minutes in ms
    };

    self.parse_pachube_options();

    self.set_start_and_end();

    // Where we will store fetched data
    self.data = new Array();

    self.update();
  };

  self.parse_pachube_options = function() {
    var options = self.element.attr('pachube-options');
    if (options == undefined) { options = ""; }
    options_hash = new Array();

    re = /([^:]*):([^;]*);/;
    while (match = options.match(re)) {
      options = options.replace(re, '');
      options_hash[match[1].trim()] = match[2].trim();
    }

    self.set_timespan_and_interval(options_hash["timespan"] || "");
    self.settings.rolling = (options_hash["rolling"] == "true");
    self.settings.update = (options_hash["update"] == "true");
  };

  self.set_timespan_and_interval = function(str) {
    switch(str) {
      case "3 months":
        self.settings.timespan = 7776000000;
        self.settings.interval = 86400;
        break;
      case "4 days":
        self.settings.timespan = 345600000;
        self.settings.interval = 3600;
        break;
      case "last hour":
        self.settings.timespan = 3600000;
        self.settings.interval = 60;
        break;
      default:
      case "24 hours": // default
        self.settings.timespan = 86400000;
        self.settings.interval = 900;
        break;
    }
  };

  self.set_start_and_end = function() {
    var d = new Date();
    if (self.settings.rolling) {
      self.end = d - (d % self.settings.polling_interval);
    } else {
      var d = new Date();
      self.end = d - (d % self.settings.interval) + self.settings.interval;
    }
    self.start = new Date(self.end - self.settings.timespan);
  };

  // Returns the last received datapoint time (or 0)
  self.last_received_at = function() {
    var length = self.data.length;
    if (length < 1) { return 0; }

    return self.data[length - 1][0];
  };

  // Fetches the data needed and calls draw
  self.update = function(callback) {
    var end = new Date();
    var start = new Date(end - self.settings.timespan);

    var last_received_at = self.last_received_at();
    if (last_received_at > start) {
      start = new Date(last_received_at);
    }

    PachubeAPI().datastreamGet({
      resource: self.settings.resource
    , api_key: self.settings.api_key
    , start: start
    , end: end
    , interval: self.settings.interval
    , per_page: 2000
    , callback: function(result) {
        for (var i=0; i < result.datapoints.length; i++) {
          var point = result.datapoints[i];
          point_at = Date.parse(point.at.substring(0,23) + "Z");
          if (point_at > last_received_at) {
            self.data.push([point_at, parseFloat(point.value)]);
          }
        }

        self.draw();

        if (callback != undefined) {
          callback(result);
        }
      }
    });
  };

  // (Re)draws the graph from self.data
  self.draw = function() {
    self.canvas = self.element.clone();
    self.canvas.removeClass = 'pachube-graph';
    self.canvas.addClass = 'pachube-graph-canvas';
    self.canvas.height = self.element.height();
    self.canvas.width = self.element.width();
    self.element.html(self.canvas); // Replace existing content

    $.plot( self.canvas
          , [self.data]
          , { xaxis:
              { mode: "time"
              , min: self.start
              , max: self.end
              }
            }
          );
  };

  self.init(element);
}

$.widget('ui.pachubeGraph', {
  _create: function() {
    this.element[0].graph = new PachubeGraph(this.element)
  }
});
