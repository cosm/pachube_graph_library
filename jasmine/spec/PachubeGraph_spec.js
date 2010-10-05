describe("PachubeGraph", function() {
  beforeEach(function() {
    loadFixtures('fixtures/minimal_graph.html')
  });

  it("should be able to call $(element).pachubeGraph", function() {
    var div = $('.pachube-graph');
    spyOn(div, 'pachubeGraph');

    div.pachubeGraph();

    expect(div.pachubeGraph).toHaveBeenCalled();
  });

  it("should call new PachubeGraph(this.element) when I call $(element).pachubeGraph()", function() {
    var div = $('.pachube-graph');

    div.pachubeGraph()

    expect(div.graph instanceof PachubeGraph);
  });
});
