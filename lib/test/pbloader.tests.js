// This file tests the pbloader.js functions
// and ensures that it load everything correctly

module ("pbloader.js");

test("it should be able to call the loader successfully", function(){
  ok(pbloader.load(), "called pbloader successfully");
});

test("it should load all jquery stuff before loading the main functions", function(){});

test("it should have called $.PB.setup_widgets()", function(){
  var oldPB = $.PB;
  $.PB = new Mock();
  $.PB.expects(1).method('setup_widgets');

  pbloader.load();

  // FIXME: This doesn't wait for the files to actually load, so the verification fails

  $.PB.verify();

  $.PB = oldPB;
});
