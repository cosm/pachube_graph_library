describe("PachubeGraph", function() {
  var api;
  var minimal_element;
  var minimal_graph;

  beforeEach(function() {
    loadFixtures('fixtures/minimal_graph.html')
  });

  it("should be defined", function() {
    expect(PachubeGraph).not.toEqual(undefined);
  });

  it("should have an 'init' method", function() {
    var graph = new PachubeGraph();
    expect(graph.init).not.toEqual(undefined);
  });

  it("init should parse an html element and call $(element).pachube_graph", function() {
    var div = $('.pachube-graph').element;
    spyOn(div, 'pachube_graph');

    (new PachubeGraph(div)).init();

    expect(div.pachube_graph).toHaveBeenCalled();
  });

  it("should have an 'initAll' method", function() {
    expect(PachubeGraph.initAll).not.toEqual(undefined);
  });
});
