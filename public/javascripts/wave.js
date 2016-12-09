// Temporary workaround until AudioContext is standardized 
window.AudioContext = window.AudioContext || window.webkitAudioContext;
 
var context = new AudioContext();
var oscillator = context.createOscillator();
oscillator.start(0);
var connected = false;
  
var playpause = function() {
	if (!connected) {
		oscillator.connect(context.destination);
	}else {
		oscillator.disconnect();
	}
	connected = !connected;
};

var setDetune = function() {
	var input = document.getElementById('input');
	oscillator.frequency.value = input.value;
};

setInterval(playpause, 500);