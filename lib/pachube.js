(function($){
  $.PB = {
    setup_widgets : function(){
      var graphs = $('.pachube-graph')
      if (graphs.length > 0){
        for (var i=0; i< graphs.length; i++) {
          $(graphs[i]).pachube_graph()
        }
      }
    }
  }

  $.pachubeAPI = {
    key : null,
    
    set_key : function(key){
      this.key = key
    },

    datastream_get : function(options) {
      if(options['start'] != undefined){var start = '&start=' + options['start'].toISOString()}else{var start = ''}
      if(options['interval'] != undefined){var interval = '&interval=' + options['interval']}else{var interval = ''}
      if(options['end'] != undefined){var end = '&end=' + options['end']}else{var interval = ''}
      if(options['per_page'] != undefined){var per_page = '&per_page=' + options['per_page']}else{var interval = ''}
      $.ajax({
        url:'http://api.pachube.com/v2/' + options['resource'] + '.json?key=' + options['key'] + interval + start + end + per_page,
        success:options['callback'],
        dataType: 'jsonp'
      })
    },
    
    datastream_put : function(options) {alert("Not implemented")},
    datastream_post : function(options) {alert("Not implemented")},
    datastream_delete : function(options) {alert("Not implemented")},
    
    environment_get : function(options) {alert("Not implemented")},
    environment_put : function(options) {alert("Not implemented")},
    environment_post : function(options) {alert("Not implemented")},
    environment_delete : function(options) {alert("Not implemented")}
}

})(jQuery);





(function($) {

$.widget( "ui.pachube_graph", {

  _create: function() {
    var self = this

    self._read_attributes(self);

    if (self.auto_update == true){
      self._recurring_update_from_api(self);
    } else {
      self._update_from_api(self);
    }
  },

  // Reads the attributes we set on startup
  _read_attributes: function(self){
    self.resource = self.element.attr('pachube-resource');
    self.key = self.element.attr('pachube-key');
    self._set_timespan(self, self.element.attr('timespan'));
    // no datapoints received
    self.points = [];
    // Poll the server for new data every 5 minutes
    self.polling_interval = 300000;
    // Are we drawing a static (midnight to midnight) style graph?
    self.static_graph = (typeof(self.element.attr('static')) != "undefined");
    self._set_auto_update(self);
  },

  // returns whether we should auto-update or not
  _set_auto_update: function(self){
    // Set up auto-update if we should do that
    self.auto_update = false;
    var attr = self.element.attr('update');
    if (typeof(attr) != "undefined"){
      attr = attr.toLowerCase();
      if (attr == "auto" || attr == "true" || attr == "yes"){
        self.auto_update = true;
      }
    }
  },

  // Set the difference between the start and end points (in ms)
  _set_timespan: function(self, value){
    switch(value)
    {
      case "3 months":
        self.timespan = 7776000000;
        break;
      case "4 days":
        self.timespan = 345600000;
        break;
      case "last hour":
        self.timespan = 3600000;
        break;
      default:
      case "24 hours": // default
        self.timespan = 86400000;
        break;
    }
  },

  _recurring_update_from_api: function(self){
    // Set up the next interval
    setTimeout(function(){self._recurring_update_from_api(self);}, self.polling_interval);
    // Fetch the new data
    self._update_from_api(self);
  },

  _update_from_api: function(self){
    var d = new Date();
    var end = new Date(d.getTime() - (d.getTime() % self.polling_interval));

    // doing a static graph (ends at midnight, instead of ending at now)
    // Round the end date forward to the next full iteration of the timespan
    if (self.static_graph == true){
      end.setTime((d.getTime() - (d.getTime() % self.timespan)) + self.timespan);
    }

    // start time is always end - 1 timespan
    var start = new Date(end.getTime() - self.timespan);

    // Set the figure out how far back we need to fetch data
    var fetch_from = start.getTime() - self.polling_interval;
    points_length = self.points.length;
    if (points_length > 0){ // We already have some data so only fetch from then onwards
      if (fetch_from < self.points[points_length - 1][0]){ // Only fetch from the latest point
        fetch_from = self.points[points_length - 1][0];
      }
    }
    fetch_from = new Date(fetch_from); // Date-ify fetch_from as datastream_get expects

    // If this is a rolling graph, remove outdated data
    var points_length = self.points.length;
    if (self.static_graph == false){
      if (points_length > 0){
        while (typeof(self.points[0]) != "undefined" && self.points[0][0] < (start.getTime() - self.polling_interval)){
          self.points.shift();
        }
      }
    }

    $.pachubeAPI.datastream_get({
      resource : self.resource,
      key : self.key,
      interval : 300,
      start : fetch_from,
      end : end,
      per_page : 2000,
      callback : function(data){
        $(self.element).html(''); // empty the div
        self._data_received_from_api(self, data, start, end); // redraw it
      }
    })
  },

  _data_received_from_api: function(self, data, start, end){
    if (typeof(data.datapoints) != "undefined"){
      for(var i=0; i< data.datapoints.length; i++){
        self.points.push([Date.parse(data.datapoints[i].at.substring(0,23) + "Z"), parseFloat(data.datapoints[i].value)])
      }
    }

    var graph = $(self.element).clone();
    graph.removeClass = 'pachube-graph';
    graph.addClass = 'pachube-graph-canvas';
    $(self.element).html(graph); // Replace the existing content

    var timespan_link = function(value) {
      var link = document.createElement('a');
      link.href = '#' + value;
      link.innerText = value;
      link.onclick = function(){
        self._set_timespan(self, value);
        self.points = []; // get rid of the data we already got
        self._update_from_api(self);
      };
      return link
    };

    var link_bar = document.createElement('div');
    link_bar.className = 'pachube-graph-links';
    link_bar.align = 'right';
    link_bar.appendChild(timespan_link('3 months'));
    link_bar.appendChild(document.createTextNode(' | '));
    link_bar.appendChild(timespan_link('4 days'));
    link_bar.appendChild(document.createTextNode(' | '));
    link_bar.appendChild(timespan_link('24 hours'));
    link_bar.appendChild(document.createTextNode(' | '));
    link_bar.appendChild(timespan_link('last hour'));
    $(self.element).prepend(link_bar);

    $.plot($(self.element).children()[1], [self.points], { xaxis: { mode: "time", min: start, max: end }});
  },
});

})(jQuery);
