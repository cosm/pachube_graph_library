describe("PachubeAPI", function(){
  beforeEach(function(){
    var api = new PachubeAPI();
  });

  it("should be defined", function(){
    expect(api != undefined);
  });

  it("should have a datastream_get function", function(){
    expect(api.datastreamGet != undefined);
  });

  it("should take an optional api_key and set it when creating the api", function(){
    api = new PachubeAPI({ api_key: "myApiKey"});
    expect(api.settings.api_key == "myApiKey");
  });
});
