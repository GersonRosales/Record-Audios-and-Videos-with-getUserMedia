let arrayAudio = [];
var startBtn = document.getElementById('startBtn');
var startBtn2 = document.getElementById('startBtn2');
let stop_Btn = document.getElementById('stopBtn');
let videoElement = document.querySelector('video');
let audioElement = document.querySelector('audio');
const downloadLink = document.getElementById('download');

function start() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(gotStreamMethod5)
  .catch(logError);
  // startBtn.disabled = true;
}

function gotStreamMethod3(stream) {
  let dataAudioTracks = stream.getAudioTracks();

  dataAudioTracks.forEach(function (track) {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    let context = new AudioContext();
    let source = context.createMediaStreamSource(stream);
    let processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      // Do something with the data, i.e Convert this to WAV
      console.log(e);
      // console.log(e.inputBuffer);
      arrayAudio.push(e.inputBuffer);
    };

    stop_Btn.addEventListener('click', function(){
      console.log('click Stop');
      track.stop();
      context.close();
      // audioElement.src = URL.createObjectURL(new Blob(arrayAudio));
      downloadLink.href = URL.createObjectURL(new Blob(arrayAudio));
      downloadLink.download = 'ac.wav';
    });

  });

}

function gotStreamMethod5(stream) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var source;
  // var button = startBtn;
  // var pre = document.querySelector('pre');
  // var myScript = document.querySelector('script');
  
  // pre.innerHTML = myScript.innerHTML;
  
  // Stereo
  var channels = 2;
  // Create an empty two second stereo buffer at the
  // sample rate of the AudioContext
  var frameCount = audioCtx.sampleRate * 2.0;
  
  // var source = audioCtx.createMediaStreamSource(stream);

  var myArrayBuffer = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);

  // console.log('gotStreamMethod5');

  startBtn.addEventListener('click', function(){
    console.log('button.onclick = function() {');
    // Fill the buffer with white noise;
    //just random values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
     // This gives us the actual ArrayBuffer that contains the data
     var nowBuffering = myArrayBuffer.getChannelData(channel);
     for (var i = 0; i < frameCount; i++) {
       // Math.random() is in [0; 1.0]
       // audio needs to be in [-1.0; 1.0]
       nowBuffering[i] = Math.random() * 2 - 1;
     }
    }
  
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    source = audioCtx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);
    // start the source playing
    // source.start();
  });

  startBtn2.addEventListener('click', function(){
    source.start();
  });
  
  stop_Btn.addEventListener('click', function(){
    console.log('click Stop');
  });
}

function logError(error) {
  alert(error);
  console.log(error);
}