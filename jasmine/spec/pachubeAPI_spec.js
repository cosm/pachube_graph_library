describe("pachubeAPI", function(){
  var api;

  beforeEach(function(){
    api = new pachubeAPI();
  });

  it("should be defined", function(){
    expect(api != undefined);
  });

  it("should have a datastream_get function", function(){
    expect(api.datastreamGet != undefined);
  });

  it("should take an optional api_key and set it when creating the api", function(){
    api = new pachubeAPI("myApiKey");
    expect(api.apiKey == "myApiKey");
  });
});
