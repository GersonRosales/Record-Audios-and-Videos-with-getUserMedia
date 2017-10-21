let startBtn = document.getElementById('startBtn');
let stop_Btn = document.getElementById('stopBtn');
var videoElement = document.querySelector('video');

function start() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  .then(gotStreamMethod1)
  .catch(logError);

  startBtn.disabled = true;
}

function gotStreamMethod1(stream) {
  console.log('stream');  
  console.log(stream);

  let dataAudioTracks = stream.getAudioTracks();

  dataAudioTracks.forEach(function (track) {
    console.log(track);

    track.onended = function () {
      console.log('stream.active');
      console.log(stream.active);
      console.log('track.readyState');
      console.log(track.readyState);
      startBtn.disabled = false;
    };

    stop_Btn.addEventListener('click', function(){
      console.log('click Stop');
      track.stop();
    });
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext = new AudioContext();
    let mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSource.connect(audioContext.destination);
  });

  dataAudioTracks.stop();
}

function logError(error) {
  alert(error);
  console.log(error);
}