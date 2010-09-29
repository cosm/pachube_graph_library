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
  
  $.fn.pachube_graph = function(){
    resource = this.attr('pachube-resource')
    key = this.attr('pachube-key')
    $.getJSON('http://api.pachube.com/v2/' + resource + '.json?key=' + key, function(data){console.log(data)})
  }
  
})(jQuery);

