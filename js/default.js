var urlParams = {};
(function () {
  var e
    , a = /\+/g  // Regex for replacing addition symbol with a space
    , r = /([^&=]+)=?([^&]*)/g
    , d = function (s) {
            return decodeURIComponent(s.replace(a, " "));
          }
    , q = window.location.search.substring(1);
 
  while (e = r.exec(q)) {
    urlParams[d(e[1])] = d(e[2]);
  }
})();

$(function() {
  function initializeForm(evt) {
    // This will populate all our text fields by url param
    for (var key in urlParams) {
      var element = $('form input:text[name="' + key + '"]');
      if (element != []) {
        element.val(urlParams[key]);
      }
    }

    // Some special fields we should try to populate
    if (urlParams['rolling'] == 'on') { $('form input[name="rolling"]').attr({'checked':true}); }
    if (urlParams['update']  == 'on') { $('form input[name="update"]').attr({'checked':true});  }
    if (urlParams['timespan'] != undefined) {
      $('form select[name="timespan"]').val(urlParams['timespan']);
    }
  }

  function submitForm(evt) {
    var values = {};
    $.each($('form').serializeArray(), function(i, field) {
      values[field.name] = field.value || urlParams[field.name];
    });

    var link_url = 'http://paulbellamy.com/pachube_graph_library?';
    var url_values = [];
    for (var key in values) {
      if (values[key] != undefined && values[key] != '') {
        url_values.push(escape(key) + '=' + escape(values[key]));
      }
    }
    link_url += url_values.join('&');

    values.id = values.id || "504";
    values.stream_id = values.stream_id || "1";
    values.key = values.key || '1iObDqRLQTi6Z3L-Gf7rKBJfSfSvrwFsmE83KrpYtCY';
    values.width = values.width || '420px';
    values.height = values.height || '240px';
    values.background = values.background || '#F0F0F0';
    var head_html = '<script type="text/javascript" src="http://paulbellamy.com/pachube_graph_library/lib/PachubeLoader.js"></script>';
    var options = { "timespan": values['timespan'] || '24 hours'
                  , "rolling":  values['rolling'] == 'on'
                  , "update":   values['update'] == 'on'
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

    var graph_html = '<div id="graph" class="pachube-graph" pachube-resource="feeds/' + values.id + '/datastreams/' + values.stream_id + '" pachube-key="' + values.key + '" pachube-options="' + optionString+ '" style="width:' + values.width +';height:'+ values.height + ';background:' + values.background +';">'
    + 'Graph: Feed ' + values.id + ', Datastream ' + values.stream_id
    + '</div>';

    var result = graph_html + "\n" + head_html;
    var clippy_result = escape(result);

    $('#link > a').attr({href: link_url});
    $('#result').html(result);
    $('#embeddable_code').text(result);
    $('#clippy').html(
         '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'
        +'       width="110"'
        +'       height="14"'
        +'       id="clippy" >'
        +'  <param name="movie" value="flash/clippy.swf"/>'
        +'  <param name="allowScriptAccess" value="always" />'
        +'  <param name="quality" value="high" />'
        +'  <param name="scale" value="noscale" />'
        +'  <param name="FlashVars" value="text=' + clippy_result + '">'
        +'  <param name="bgcolor" value="#FFFFFF">'
        +'  <embed src="flash/clippy.swf"'
        +'         width="110"'
        +'         height="14"'
        +'         name="clippy"'
        +'         quality="high"'
        +'         allowScriptAccess="always"'
        +'         type="application/x-shockwave-flash"'
        +'         pluginspage="http://www.macromedia.com/go/getflashplayer"'
        +'         FlashVars="text=' + clippy_result + '"'
        +'         bgcolor="#FFFFFF"'
        +'  />'
        +'</object>'
        );
  }

  $('#ourForm :input').bind('change', function(evt) {
    submitForm(evt);
    return false;
  });

  $('#ourForm').submit(function(evt) {
    submitForm(evt);
    return false;
  });

  // Set stuff up
  initializeForm();
  submitForm();
});
