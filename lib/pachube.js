(function($){
  $.PB = {
    setup_widgets : function(){
      var graphs = $('.pachube-graph')
      if (graphs.length > 0){
        for (var i=0; i< graphs.length; i++) {
          $(graphs[i]).pachube_graph()
        }
      }
    },
    update_graph : function(elem, data){
      $(elem).html(data.current_value)
      points = []
      for(var i=0; i< data.datapoints.length; i++){
        points.push([Date.parse(data.datapoints[i].at), parseFloat(data.datapoints[i].value)])
      }
      $.plot($(elem), [points], { xaxis: { mode: "time" }});
    }
  }
  
  $.fn.pachube_graph = function(){
    resource = this.attr('pachube-resource')
    key = this.attr('pachube-key')
    self = this
    $.ajax({url:'http://api.pachube.com/v2/' + resource + '.json?key=' + key + "&interval=300&start=2010-09-28&end=2010-09-29&per_page=2000",
            success:function(data){$.PB.update_graph(self, data)},
            dataType: 'jsonp'})
    
  }
  
})(jQuery);

