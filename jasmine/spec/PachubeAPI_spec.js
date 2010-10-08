describe("PachubeAPI", function() {
  var api;

  beforeEach(function() {
    api = new PachubeAPI();
  });

  it("should be defined", function() {
    expect(api).not.toEqual(undefined);
  });

  it("an instance should be accessible at pachubeAPI", function() {
    expect(pachubeAPI).not.toEqual(undefined);
    expect(pachubeAPI instanceof PachubeAPI);
  });

  it("should take an optional api_key and set it when creating the api", function() {
    api = new PachubeAPI({ api_key: "myApiKey"});
    expect(api.settings.api_key).toEqual("myApiKey");
  });

  it("should be possible to call it through the class", function() {
    spyOn($, 'ajax');
    var callback = function() {};
    var options = {
      resource: "myResource"
    , api_key: "myApiKey"
    , interval: 500
    , start: new Date()
    , end: new Date()
    , per_page: 2000
    , callback: callback
    };

    runs(function() {
      PachubeAPI().datastreamGet(options);
    });

    waits(500);

    runs(function() {
      expect($.ajax).toHaveBeenCalledWith({
        url: 'http://api.pachube.com/v2/' + options.resource + '.json?key=' + options.api_key + '&interval=' + options.interval + '&start=' + options.start.toISOString() + '&end=' + options.end.toISOString() + '&per_page=' + options.per_page
      , success: options.callback
      , dataType: 'jsonp'
      });
    });
  });

  it("should have a datastreamGet function", function() {
    expect(api.datastreamGet).not.toEqual(undefined);
  });

  describe("datastreamGet", function() {
    var api;

    beforeEach(function() {
      api = new PachubeAPI();
    });

    it("should call an ajax request to api.pachube.com", function() {
      spyOn($, 'ajax');
      var callback = function() {};
      var options = {
        resource: "myResource"
      , api_key: "myApiKey"
      , interval: 500
      , start: new Date()
      , end: new Date()
      , per_page: 2000
      , callback: callback
      };

      runs(function() {
        api.datastreamGet(options);
      });

      waits(500);

      runs(function() {
        expect($.ajax).toHaveBeenCalledWith({
          url: 'http://api.pachube.com/v2/' + options.resource + '.json?key=' + options.api_key + '&interval=' + options.interval + '&start=' + options.start.toISOString() + '&end=' + options.end.toISOString() + '&per_page=' + options.per_page
        , success: options.callback
        , dataType: 'jsonp'
        });
      });
    });

    it("should use the default api_key if we don't provide one at call time", function() {
      api = new PachubeAPI({api_key: "oldApiKey"});

      spyOn($, 'ajax');
      var callback = function() {};
      var options = {
        resource: "myResource"
      , interval: 500
      , start: new Date()
      , end: new Date()
      , per_page: 2000
      , callback: callback
      };

      api.datastreamGet(options);

      expect($.ajax).toHaveBeenCalledWith({
        url: 'http://api.pachube.com/v2/' + options.resource + '.json?key=' + api.settings.api_key + '&interval=' + options.interval + '&start=' + options.start.toISOString() + '&end=' + options.end.toISOString() + '&per_page=' + options.per_page
      , success: options.callback
      , dataType: 'jsonp'
      });
    });

    it("should only *require* a resource", function() {
      api = new PachubeAPI("myApiKey");
      spyOn($, 'ajax');
      var options = {
        resource: "myResource"
      };

      api.datastreamGet(options);

      expect($.ajax).toHaveBeenCalledWith({
        url: 'http://api.pachube.com/v2/' + options.resource + '.json?key=' + api.settings.api_key
      , dataType: 'jsonp'
      });
    });
  });
});

