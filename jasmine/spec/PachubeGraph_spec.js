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

  it("should parse a timespan values and set timespan and interval accordingly", function() {
    minimal.pachubeGraph(); // defaults (should equal twenty_four_hours)
    expect(minimal[0].graph.settings.timespan).toEqual(86400000);
    expect(minimal[0].graph.settings.interval).toEqual(900);

    loadFixtures('fixtures/last_hour.html')
    var last_hour = $('.pachube-graph');
    last_hour.pachubeGraph();
    expect(last_hour[0].graph.settings.timespan).toEqual(3600000);
    expect(last_hour[0].graph.settings.interval).toEqual(60);

    loadFixtures('fixtures/twenty_four_hours.html')
    var twenty_four_hours = $('.pachube-graph');
    twenty_four_hours.pachubeGraph();
    expect(twenty_four_hours[0].graph.settings.timespan).toEqual(86400000);
    expect(twenty_four_hours[0].graph.settings.interval).toEqual(900);

    loadFixtures('fixtures/four_days.html')
    var four_days = $('.pachube-graph');
    four_days.pachubeGraph();
    expect(four_days[0].graph.settings.timespan).toEqual(345600000);
    expect(four_days[0].graph.settings.interval).toEqual(3600);

    loadFixtures('fixtures/three_months.html')
    var three_months = $('.pachube-graph');
    three_months.pachubeGraph();
    expect(three_months[0].graph.settings.timespan).toEqual(7776000000);
    expect(three_months[0].graph.settings.interval).toEqual(86400);
  });

  it("should have a 'data' parameter for storing fetched data", function() {
    minimal.pachubeGraph();

    expect(minimal[0].graph.data).not.toEqual(undefined);
  });

  it("should send call the api to fetch the initial data", function() {
    spyOn(pachubeAPI, datastreamGet);

    minimal.pachubeGraph();

    expect(pachubeAPI.datastreamGet).toHaveBeenCalledWith({
      resource: minimal[0].graph.settings.resource
    , api_key: minimal[0].graph.settings.api_key
    , interval: minimal[0].graph.settings.interval
    });
  });
});
