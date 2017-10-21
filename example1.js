let recorder;
let context;
let track1;
let audio = document.querySelector('audio');
let start = document.querySelector('#startRecording');
let stop = document.querySelector('#stopRecording');

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

let onFail = function(e) {
  alert('Error '+e);
  console.log('Rejected!', e);
};

let onSuccess = function(s) {
  s.getAudioTracks().forEach(function (track) {
    console.log('Recording...');
    console.log(track);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    var mediaStreamSource = context.createMediaStreamSource(s);
    recorder = new Recorder(mediaStreamSource);
    recorder.record();
    track1 = track;
  });
}

start.addEventListener('click', ()=>{
  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true}, onSuccess, onFail);
  } else {
    console.warn('navigator.getUserMedia not present');
  }
})

stop.addEventListener('click', ()=>{
  console.log('Stop Recording...');
  recorder.stop();
  track1.stop();
  try {
    recorder.exportWAV(function(s) {
      audio.src = window.URL.createObjectURL(s);
    });
  } catch (error) {
    console.error('error');
    console.error(error);
  }
})
