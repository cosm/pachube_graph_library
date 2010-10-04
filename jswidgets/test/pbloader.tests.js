// This file tests the pbloader.js functions
// and ensures that it load everything correctly

module ("pbloader.js");

test("it should be able to call the loader successfully", function(){
  ok(pbloader.load(), "called pbloader successfully");
});

test("it should load all jquery stuff before loading the main functions", function(){});

test("it should call $.PB.setup_widgets()", function(){
  expect($.PB.setup_widgets);
  pbloader.load();
});
