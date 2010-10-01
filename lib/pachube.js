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

    self._update_from_api(self);
  },

  _get_data_from_api: function(self, callback){
    var resource = self.element.attr('pachube-resource')
    var key = self.element.attr('pachube-key')
    var d = new Date();
    var end = new Date(d.getTime() - (d.getTime() % 300000));
    var timespan = self.element.attr('timespan');

    // Set the difference between the start and end points (in ms)
    switch(timespan)
    {
      case "3 months":
        var difference = 7776000000;
        break;
      case "4 days":
        var difference = 345600000;
        break;
      case "last hour":
        var difference = 3600000;
        break;
      default:
      case "24 hours": // default
        var difference = 86400000;
        break;
    }
    var start = new Date(end.getTime() - difference)

    // doing a static graph (ends at midnight, instead of ending at now)
    // Round the date forward to the next full iteration of the difference
    if (typeof(self.element.attr('static')) != "undefined"){
      end.setTime((d.getTime() - (d.getTime() % difference)) + difference);
    }

    $.pachubeAPI.datastream_get({
      resource : resource,
      key : key,
      interval : 300,
      start : start,
      end : end,
      per_page : 2000,
      callback : function(data){
        $(self.element).html(''); // empty the div
        self._draw_from_data(self, data, start, end); // redraw it
      }
    })
  },

  _draw_from_data: function(self, data, start, end){
    var points = []
    if (typeof(data.datapoints) != "undefined"){
      for(var i=0; i< data.datapoints.length; i++){
        points.push([Date.parse(data.datapoints[i].at.substring(0,23) + "Z"), parseFloat(data.datapoints[i].value)])
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
        $(self.element).attr('timespan', value);
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

    $.plot($(self.element).children()[1], [points], { xaxis: { mode: "time", min: start, max: end }});
  },
  
  _update_from_api: function(self){
    self._get_data_from_api(self);
  }
  
});

})(jQuery);
