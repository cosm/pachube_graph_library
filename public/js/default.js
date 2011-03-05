$(function() {
  function submitForm(evt) {
    var values = {};
    $.each($('form').serializeArray(), function(i, field) {
      values[field.name] = field.value;
    });
    var head_html = '<script type="text/javascript" src="http://www.pachube.com/widgets/PachubeLoader.js"></script>';
    var options = { "timespan": values['timespan']
                  , "rolling":  values['rolling']
                  , "update":   values['update']
                  , "background-color":  values['background-color']
                  , "line-color":        values['line-color']
                  , "grid-color":        values['grid-color']
                  , "border-color":      values['border-color']
                  , "text-color":        values['text-color']
                  };

    var optionString = ""
    for (var key in options) {
      if (options[key] != undefined && options[key] != '') {
        optionString += key + ':' + options[key] + ';';
      }
    }

    var graph_html = '<div id="graph" class="pachube-graph" pachube-resource="/feeds/' + values.id + '/datastreams/' + values.stream_id + '" pachube-key="' + values.key + '" pachube-options="' + optionString+ '" style="width:' + values.width +';height:'+ values.height + ';background:' + values.background +';">'
    + 'Graph: Feed ' + values.id + ', Datastream ' + values.stream_id
    + '</div>';

    var result = graph_html + "\n" + head_html

    $('#result').html(result);
    $('#embeddable_code').text(result);
  }

  $('#ourForm').submit(function(evt) {
    submitForm(evt);
    return false;
  });
});
