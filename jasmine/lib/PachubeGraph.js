$.widget('ui.pachube_graph', {
  
});

function PachubeGraph(element) {
  // Magic Incantation to enforce instantiation
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  if (element != undefined) {
    self.init(element);
  }
}

PachubeGraph.prototype.init = function(element) {
  //$(element).pachube_graph();
};

PachubeGraph.initAll = function() {
};
