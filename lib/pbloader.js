var readyfiles = []
function ready(file){
  readyfiles.push(file)
  if(readyfiles.length == files.length){  
    console.log("We are ready");
  }
}

function loadjs(file){
  if(file.split('.').pop() == 'js'){
    var elem=document.createElement('script');
    elem.type = "text/javascript";
    elem.src = file;
    elem.onload = function(){ready(file);}
    document.getElementsByTagName("head")[0].appendChild(elem)
  }
}

files = ['http://localhost:4567/pachube.js', 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js']

for (file in files){
  loadjs(files[file]);
}