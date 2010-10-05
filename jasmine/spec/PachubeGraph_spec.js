describe("PachubeGraph", function() {
  var api;
  var minimal_element;
  var minimal_graph;

  beforeEach(function() {
    minimal_element = '<div id="graph" class="pachube-graph" pachube-resource="myResource" pachube-key="myApiKey" style="width: 640px; height: 480px;"></div>';
    minimal_graph = new PachubeGraph(minimal_element);
  });

  it("should be defined", function() {
    expect(PachubeGraph).not.toEqual(undefined);
  });

  it("should have an 'init' method", function() {
    var graph = new PachubeGraph();
    expect(graph.init).not.toEqual(undefined);
  });

  it("init should parse an html element and call $.widget", function() {
    spyOn($, 'widget');

    minimal_graph.init();

    expect($.widget).toHaveBeenCalled();
  });

  it("should have an 'initAll' method", function() {
    expect(PachubeGraph.initAll).not.toEqual(undefined);
  });
});
