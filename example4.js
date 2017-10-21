var startBtn = document.getElementById('startBtn');
let audioElement = document.querySelector('audio');

function start() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(gotStreamMethod2)
  .catch(logError);
  startBtn.disabled = true;
}

function gotStreamMethod2(stream) {
  console.log('stream');  
  console.log(stream);
  window.stream = stream; // make stream available to console
  audioElement.srcObject = stream;
}

function logError(error) {
  alert(error);
  console.log(error);
}