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
    var resource = this.element.attr('pachube-resource')
    var key = this.element.attr('pachube-key')
    var d = new Date()
    var self = this
    $.pachubeAPI.datastream_get({
      resource : resource,
      key : key,
      interval : 300,
      start : new Date((d.getTime() - d.getTime() % 300000) - 86400000),
      end : new Date(d.getTime() - d.getTime() % 300000),
      per_page : 2000,
      callback : function(data){self._update_from_api(self, data)}
    })
  },
  
  _update_from_api: function(self, data){
    var points = []
    for(var i=0; i< data.datapoints.length; i++){
      points.push([Date.parse(data.datapoints[i].at.substring(0,23) + "Z"), parseFloat(data.datapoints[i].value)])
    }
    $.plot($(self.element), [points], { xaxis: { mode: "time" }});
  }
  
});

})(jQuery);
