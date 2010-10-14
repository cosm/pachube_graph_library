var PachubeLoader = new function() {
  var self = this;

  var loadScript = function(file, callback){
    if(file.split('.').pop() == 'js'){
      var elem=document.createElement('script');
      elem.type = "text/javascript";
      if (elem.readyState) { // IE
        elem.onreadystatechange = function(){
          if (elem.readyState == "loaded" ||
              elem.readyState == "complete"){
            elem.onreadystatechange = null;
            callback();
          }
        };
      } else { // Others
        elem.onload = function(){callback();};
      }
      elem.src = file;
      document.getElementsByTagName("head")[0].appendChild(elem);
    }
  };

  var loadScripts = function(files, callback){
    var length = files.length
    for (file in files){
      loadScript(files[file], function(){if(--length == 0){callback();}});
    }
  };

  var jquery_files = ['http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js',
                      '/vendor/jquery-ui-1.8.5.core.min.js',
                      '/vendor/jquery.flot.js'];
  var pachube_files = ['/PachubeAPI.js',
                       '/PachubeGraph.js'];

  self.load = function(){
    loadScripts(jquery_files, function(){
      loadScripts(pachube_files, function(){
        var graph_divs = $('.pachube-graph');
        for (var i=0; i < graph_divs.length: i++) {
          graph_divs.pachubeGraph();
        }
      });
    });
    return true;
  };
}

PachubeLoader.load();
