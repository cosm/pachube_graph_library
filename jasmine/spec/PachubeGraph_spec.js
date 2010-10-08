describe("PachubeGraph", function() {
  var minimal;

  beforeEach(function() {
    loadFixtures('fixtures/minimal_graph.html')
    minimal = $('.pachube-graph');
  });

  it("should be able to call $(element).pachubeGraph", function() {
    spyOn(minimal, 'pachubeGraph');

    minimal.pachubeGraph();

    expect(minimal.pachubeGraph).toHaveBeenCalled();
  });

  it("should call new PachubeGraph(this.element) when I call $(element).pachubeGraph()", function() {
    minimal.pachubeGraph();

    expect(minimal[0].graph instanceof PachubeGraph);
  });

  it("PachubeGraph(element) should parse the attributes from the html element", function() {
    minimal.pachubeGraph();

    expect(minimal[0].graph.settings.resource).toEqual("myResource");
    expect(minimal[0].graph.settings.api_key).toEqual("myApiKey");
    expect(minimal[0].graph.settings.rolling).toEqual(false);
    expect(minimal[0].graph.settings.update).toEqual(false);
  });
});
