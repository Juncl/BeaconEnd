// Temporary workaround until AudioContext is standardized 
window.AudioContext = window.AudioContext || window.webkitAudioContext;
 
var context = new AudioContext();
var oscillator = context.createOscillator();
oscillator.start(0);
var connected = false;
var flag = 0;
  
var playpause = function() {

    if (!connected) {
      oscillator.connect(context.destination);
      console.log('响');
      loadJSON();
      console.log("播放:"+new Date().getTime());
    }
    else { 
      oscillator.disconnect();
      console.log('不响');
    }
    connected = !connected;

    setTimeout(arguments.callee, 1000);
};

function isFun(n){
	if(n%5 == 1) return true;
	else return false;
}

var setDetune = function() {
	var input = document.getElementById('freq');
	oscillator.frequency.value = input.value;
};

function loadJSON(){
        // var data_file = "http://www.tutorialspoint.com/json/data.json";

        var beaconId = document.getElementById("beaconInput").value;
        var freq = document.getElementById("freq").value;

        var data_file = "http://172.18.216.95:3000/api?dtime="+new Date().getTime()
            +"&beaconId="+beaconId+"&freq="+freq;

        console.log(new Date().getTime());
            
        var http_request = new XMLHttpRequest();
        try{
            // Opera 8.0+, Firefox, Chrome, Safari
            http_request = new XMLHttpRequest();
        }catch (e){
            // Internet Explorer Browsers
            try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
                    
            }catch (e) {
                
                try{
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                }catch (e){
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
                    
            }
        }
            
        http_request.onreadystatechange = function(){
            
            if (http_request.readyState == 4  ){
                // Javascript function JSON.parse to parse JSON data
                var jsonObj = JSON.parse(http_request.responseText);

                console.log(jsonObj);

                // document.getElementById("p").innerHTML = jsonObj.name;
                

                var localTime = new Date().getTime();
                var Dtime = localTime - jsonObj.time;
                document.getElementById("Stime").innerHTML = jsonObj.time;
                document.getElementById("Ltime").innerHTML = localTime;
                document.getElementById("Dtime").innerHTML = Dtime;
                console.log("Server Time:"+jsonObj.time);
                console.log("Local Time:"+localTime);
                console.log("Dtime: "+Dtime);
            }
        }
            
        http_request.open("GET", data_file, true);
        http_request.send();
    }

// setInterval(playpause, 500);