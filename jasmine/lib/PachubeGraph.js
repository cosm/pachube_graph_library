function PachubeGraph(element) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  if (element != undefined) {
    self.element = element;
  }

  self.init = function() {

  }

  self.init();
}

$.widget('ui.pachubeGraph', {
  _create: function() {
    this.element.graph = PachubeGraph(this.element)
  }
});
