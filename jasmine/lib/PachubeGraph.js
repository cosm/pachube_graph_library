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
    , rolling: false
    , update: false
    };
  }

  self.init(element);
}

$.widget('ui.pachubeGraph', {
  _create: function() {
    this.element[0].graph = new PachubeGraph(this.element)
  }
});
