function PachubeAPI(options) {
  // Magic Incantation to enforce new
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;

  if (options != undefined) {
    self.settings = {
      api_key: options.api_key
    };
  }

  this.datastreamGet = function() {};
}
