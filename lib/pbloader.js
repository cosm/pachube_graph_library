var pb_api_key = ''
var pb_readypb_files = []
function ready(file){
  pb_readypb_files.push(file)
  if(pb_readypb_files.length == pb_files.length){  
    console.log("We are ready. Key: " + pachube_api_key);
  }
}

function pb_loadjs(file){
  if(file.split('.').pop() == 'js'){
    var elem=document.createElement('script');
    elem.type = "text/javascript";
    elem.src = file;
    elem.onload = function(){ready(file);}
    document.getElementsByTagName("head")[0].appendChild(elem)
  }
}

pb_files = ['http://localhost:4567/pachube.js', 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js']

var scripts = document.getElementsByTagName('script');
for (i in scripts){
  if (scripts[i].src != undefined){
    match = scripts[i].src.split('/').pop().match(/^pbloader\.js\?key=(.*)$/)
    if(match){
      pachube_api_key = match[1]
    }
  }
}

if (pachube_api_key != ''){
  for (file in pb_files){
    pb_loadjs(pb_files[file]);
  }
}