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

    // Where we will store fetched data
    self.data = new Array();

    if (self.settings.update) {
      setInterval(self.update, self.settings.polling_interval);
    }
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
      self.end = new Date(d - (d % self.settings.polling_interval));
    } else {
      var rounding = Math.min(self.settings.timespan, 86400000); // Never round to more than a day
      self.end = new Date(d - (d % rounding) + rounding);

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
    self.set_start_and_end();
    var fetch_from = self.start;

    var last_received_at = self.last_received_at();
    if (last_received_at > fetch_from) {
      fetch_from = new Date(last_received_at);
    }

    PachubeAPI().datastreamGet({
      resource: self.settings.resource
    , api_key: self.settings.api_key
    , start: fetch_from
    , end: self.end
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

  var timespan_link = function(value) {
    var link = document.createElement('a');
    link.href = '#' + value;
    link.innerText = value;
    link.onclick = function() {
      self.set_timespan_and_interval(value);
      self.data = []; // get rid of the data we already got
      self.update();
    };
    return link;
  }

  // (Re)draws the graph from self.data
  self.draw = function() {
    if (self.canvas == undefined) {
      var canvas = self.element.clone();
      canvas.removeClass('pachube-graph');
      canvas.addClass('pachube-graph-canvas');
      canvas.height = self.element.height();
      canvas.width = self.element.width();
      self.element.html(canvas); // Replace existing content
      self.canvas = $(self.element).children(canvas);
    }

    if (self.link_bar == undefined) {
      var link_bar = document.createElement('div');
      link_bar.className = 'pachube-graph-link-bar';
      link_bar.align = 'right';
      link_bar.appendChild(timespan_link("3 months"));
      link_bar.appendChild(document.createTextNode(' | '));
      link_bar.appendChild(timespan_link("4 days"));
      link_bar.appendChild(document.createTextNode(' | '));
      link_bar.appendChild(timespan_link("24 hours"));
      link_bar.appendChild(document.createTextNode(' | '));
      link_bar.appendChild(timespan_link("last hour"));
      self.element.prepend(link_bar);
      self.link_bar = $(self.element).children('.pachube-graph-link-bar');
    }

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
