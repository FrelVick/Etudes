window.addEventListener("load", function (){
  
  var elem = document.getElementById("elem");
   
  for (var i = 59; i >= 0; i--){
    
    setTimeout(function() {
      elem.innerHTML = i;
    }, (60-i) * 1000);
  }
  
  
  /*
  var i = 59;
  var f = function () {
    
    if (l < 0) return;
    
    elem.innerHTML = i;
    i--;
    
    setTimeout(f, 1000);
    
  }; 
  */
  
});