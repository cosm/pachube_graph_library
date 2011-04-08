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
  var apps_url = 'http://beta.apps.pachube.com'
  var script_url = 'http://beta.apps.pachube.com/embeddable_graphs';
  var token = '';
  var data = {system: {}, user: {}};

  function initializeForm(evt) {
    // This will populate all our text fields by url param
    for (var key in urlParams) {
      var element = $('form input:text[name="' + key + '"]');
      if (element != []) {
        element.val(urlParams[key]);
      }    }

    // Some special fields we should try to populate
    if (urlParams['rolling'] == 'on') { $('form input[name="rolling"]').attr({'checked':true}); }
    if (urlParams['update']  == 'on') { $('form input[name="update"]').attr({'checked':true});  }
    if (urlParams['timespan'] != undefined) {
      $('form select[name="timespan"]').val(urlParams['timespan']);
    }

    // if we got passed a token from the appstore fetch data for it
    if (urlParams["token"] != undefined) {
      token = urlParams["token"];
      fetchUserData(token);
    } else {
      updateSource();
    }
  }

  function fetchUserData(token) {
    $.get(apps_url + "/conf/" + token, function(response) {
      data = response;
      if (data.system.get != undefined) {
        // If we got an api key back from storage
        $('form fieldset#data').hide();
        $('form input[name="id"]').val(data.system.get[0].feed_id);
        $('form input[name="stream_id"]').val(data.system.get[0].datastream_id);
        $('form input[name="key"]').val(data.system.get[0].key);
      }

      if (data.user != undefined) {
        // If we have stored user data, pre-populate the form
        for (var i in data.user) {
          if (data.user.hasOwnProperty(i) && urlParams[i] == undefined) {
            $('form [name="'+i+'"]').val(data.user[i]);
          }
        }

        // A few special fields we need to set up
        if (data.user['rolling'] == 'on') { $('form [name="rolling"]').attr({'checked':true}); }
        if (data.user['update']  == 'on') { $('form [name="update"]').attr({'checked':true});  }
      }

      updateSource();
    });
  }

  function saveUserData() {
    $.ajax({ url: apps_url + '/conf/'+token+'/user'
           , type: 'PUT'
           , processData: false
           , data: JSON.stringify(data.user)
           });
  }

  function readDataFromForm() {
    var values = {};

    $.each($('form').serializeArray(), function(i, field) {
      if (field.value == '') { field.value = undefined; }
      values[field.name] = field.value || urlParams[field.name];
      data.user[field.name] = values[field.name] || data.user[field.name];
    });
    var k = Object.keys(data.user);
    for (var i in k) {
      var key = k[i];
      if (data.user.hasOwnProperty(key) && values[key] == undefined) {
        delete data.user[key];
      }
    }

    // Set some defaults
    values.id = values.id || "504";
    values.stream_id = values.stream_id || "1";
    values.key = values.key || '1iObDqRLQTi6Z3L-Gf7rKBJfSfSvrwFsmE83KrpYtCY';
    values.width = values.width || '420px';
    values.height = values.height || '240px';
    values.background = values.background || '#F0F0F0';

    return values;
  }

  function updateSource() {
    var values = readDataFromForm();

    // Save our values to the server
    saveUserData();

    var link_url = script_url + '/?';
    var url_values = [];
    for (var key in data.user) {
      if (values[key] != undefined && values[key] != '') {
        url_values.push(escape(key) + '=' + escape(values[key]));
      }
    }
    link_url += url_values.join('&');

    var head_html = '<script type="text/javascript" src="'+script_url+'/lib/PachubeLoader.js"></script>';
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

  function submitForm(evt) {
    updateSource();
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
});
