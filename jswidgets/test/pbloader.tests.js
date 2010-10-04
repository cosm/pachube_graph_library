// This file tests the pbloader.js functions
// and ensures that it load everything correctly

module ("pbloader.js");

test("it should load all the required files", function(){
  var scripts = document.getElementsByTagName("script");
  equals(scripts[scripts.length - 1].src, "/pachube.js")
  equals(scripts[scripts.length - 2].src, "/jquery.flot.js")
  equals(scripts[scripts.length - 3].src, "/jquery-ui-1.8.5-core.min.js")
  equals(scripts[scripts.length - 4].src, "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js")
});

test("it should be able to call the loader successfully", function(){
  ok(pbloader.load(), "called pbloader successfully");
});

test("it should load all jquery stuff before loading the main functions");

test("it should call $.PB.setup_widgets()", function(){
  expect($.PB.setup_widgets);
  pbloader.load();
});
