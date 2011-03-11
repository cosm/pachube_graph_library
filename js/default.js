$(function() {
  function submitForm(evt) {
    var values = {};
    $.each($('form').serializeArray(), function(i, field) {
      values[field.name] = field.value;
    });
    values.id = values.id || "504";
    values.stream_id = values.stream_id || "1";
    values.key = values.key || '1iObDqRLQTi6Z3L-Gf7rKBJfSfSvrwFsmE83KrpYtCY';
    values.width = values.width || '420px';
    values.height = values.height || '240px';
    values.background = values.background || '#F0F0F0';
    var head_html = '<script type="text/javascript" src="lib/PachubeLoader.js"></script>';
    var options = { "timespan": values['timespan']
                  , "rolling":  values['rolling']
                  , "update":   values['update']
                  , "background-color":  values['background-color'] || "#FFFFFF"
                  , "line-color":        values['line-color'] || "#FF0066"
                  , "grid-color":        values['grid-color'] || "#EFEFEF"
                  , "border-color":      values['border-color'] || "#9D9D9D"
                  , "text-color":        values['text-color'] || "#555555"
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

  $('#ourForm :input').bind('change', function(evt) {
    submitForm(evt);
    return false;
  });

  $('form').submit(function(evt) { return false; }); // So the form will not submit
});
