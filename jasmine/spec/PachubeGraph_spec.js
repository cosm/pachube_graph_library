describe("PachubeGraph", function() {
  var minimal;
  var last_hour;
  var twenty_four_hours;
  var four_days;
  var three_months;
  var data;
  var graph_data = [];
  var now = "2010-10-13T14:10:55.747Z";
  var oldAjax = $.ajax;

  beforeEach(function() {
    loadFixtures('fixtures/minimal_graph.html',
                 'fixtures/last_hour.html',
                 'fixtures/twenty_four_hours.html',
                 'fixtures/four_days.html',
                 'fixtures/three_months.html');
    minimal = $('#minimal.pachube-graph');
    last_hour = $('#last_hour.pachube-graph');
    twenty_four_hours = $('#twenty_four_hours.pachube-graph');
    four_days = $('#four_days.pachube-graph');
    three_months = $('#three_months.pachube-graph');

    data = 
      [ {at: "2010-10-13T14:10:51.747789Z", value: "1309"}
      , {at: "2010-10-13T14:10:52.747789Z", value: "1310"}
      , {at: "2010-10-13T14:10:53.747789Z", value: "1311"}
      , {at: "2010-10-13T14:10:54.747789Z", value: "1312"}
      ];

    graph_data =
      [ [1286979051747, 1309]
      , [1286979052747, 1310]
      , [1286979053747, 1311]
      , [1286979054747, 1312]
      ];

    $.ajax = function(options) {
      if (options == undefined) { var options = {}; }

      // Handle start and end params effectively
      if (options.start != undefined) {
        var new_data = [];
        for(var i=0; i < data.length; i++) {
          if (graph_data[i][0] > options.start) {
            new_data.push(data[i]);
          }
        }
        data = new_data;
      }
      if (options.end != undefined) {
        var new_data = [];
        for(var i=0; i < data.length; i++) {
          if (graph_data[i][0] < options.end) {
            new_data.push(data[i]);
          }
        }
        data = new_data;
      }

      var result = {
        datapoints: data
      };

      if (options.success != undefined) {
        options.success(result);
      }

      return result;
    };
  });

  afterEach(function() {
    $.ajax = oldAjax
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
    expect(minimal[0].graph.settings.per_page).toEqual(2000);
  });

  it("should parse a timespan values and set timespan and interval accordingly", function() {
    minimal.pachubeGraph(); // defaults (should equal twenty_four_hours)
    expect(minimal[0].graph.settings.timespan).toEqual(86400000);
    expect(minimal[0].graph.settings.interval).toEqual(900);

    last_hour.pachubeGraph();
    expect(last_hour[0].graph.settings.timespan).toEqual(3600000);
    expect(last_hour[0].graph.settings.interval).toEqual(60);

    twenty_four_hours.pachubeGraph();
    expect(twenty_four_hours[0].graph.settings.timespan).toEqual(86400000);
    expect(twenty_four_hours[0].graph.settings.interval).toEqual(900);

    four_days.pachubeGraph();
    expect(four_days[0].graph.settings.timespan).toEqual(345600000);
    expect(four_days[0].graph.settings.interval).toEqual(3600);

    three_months.pachubeGraph();
    expect(three_months[0].graph.settings.timespan).toEqual(7776000000);
    expect(three_months[0].graph.settings.interval).toEqual(86400);
  });

  it("should have a 'data' parameter for storing fetched data", function() {
    minimal.pachubeGraph();

    expect(minimal[0].graph.data).not.toEqual(undefined);
  });

  it("should call the api to fetch the initial data", function() {
    spyOn($, 'ajax');

    runs(function() {
      minimal.pachubeGraph();
    });

    waits(500);

    runs(function() {
      expect($.ajax).toHaveBeenCalled();
    });
  });

  it("should have an 'update' method", function() {
    minimal.pachubeGraph();
    expect(minimal[0].graph.update).not.toEqual(undefined);
  });

  it("should have a 'draw' method", function() {
    minimal.pachubeGraph();
    expect(minimal[0].graph.draw).not.toEqual(undefined);
  });

  it("'update' should push the received datapoints into data", function() {
    minimal.pachubeGraph();

    runs(function() {
      minimal[0].graph.update();
    });

    waits(500);

    expect(minimal[0].graph.data).toEqual(graph_data);
  });

  it("'update' should only request new data", function() {
    minimal.pachubeGraph();

    expect(minimal[0].graph.data).toEqual(graph_data);

    minimal[0].graph.update(function(results) {
      expect(results.datapoints).toEqual([]);
    });
  });

  it("'update' should not store duplicate data", function() {
    minimal.pachubeGraph();
    minimal[0].graph.update();
    expect(minimal[0].graph.data).toEqual(graph_data);
  });

  it("'update' should call 'draw'", function() {
    minimal.pachubeGraph();

    spyOn(minimal[0].graph, 'draw');

    runs(function() {
      minimal[0].graph.update();
    });

    waits(500);

    runs(function() {
      expect(minimal[0].graph.draw).toHaveBeenCalled();
    });
  });
});
