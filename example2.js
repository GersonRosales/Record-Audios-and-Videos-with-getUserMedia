'use strict';

/* globals MediaRecorder */
// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// var constraints;
console.log('getBrowser');
console.log(getBrowser());

if (getBrowser() == "Chrome") {
	console.log('if Chrome');
	var constraints = {"audio": true, "video": {  "mandatory": {  "minWidth": 640,  "maxWidth": 640, "minHeight": 480,"maxHeight": 480 }, "optional": [] } }; //Chrome
} else if (getBrowser() == "Firefox") {
	console.log('else Firefox');
	var constraints = {audio: true, video: { width: { min: 640, ideal: 640, max: 640 },  height: { min: 480, ideal: 480, max: 480 } } }; //Firefox
} else {
	console.log('else Chrome');
	var constraints = {"audio": true, "video": false };//Chrome
}

let recBtn = document.querySelector('button#rec');
let pauseResBtn = document.querySelector('button#pauseRes');
let stopBtn = document.querySelector('button#stop');
let videoElement = document.querySelector('video');
let dataElement = document.querySelector('#data');
let audio1 = document.querySelector('audio');
let shouldStop = false;
let stopped = false;
let mediaRecorder;
let downloadLink = document.getElementById('download');
let stopButton = document.getElementById('stop');
let startButton1 = document.getElementById('start1');
let startButton2 = document.getElementById('start2');
let startButton3 = document.getElementById('start3');
let startButton4 = document.getElementById('start4');
let playButton = document.getElementById('play');
let chunks = [];
let count = 0;

function startRecording(stream) {
	log('Start recording...');
	if (typeof MediaRecorder.isTypeSupported == 'function'){
		/*
			MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
		*/
		if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		  var options = {mimeType: 'video/webm;codecs=vp9'};
		} else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
		  var options = {mimeType: 'video/webm;codecs=h264'};
		} else  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
		  var options = {mimeType: 'video/webm;codecs=vp8'};
		}
		log('Using '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream); //stream, options
	} else {
		log('Using default codecs for browser');
		mediaRecorder = new MediaRecorder(stream);
	}

	pauseResBtn.textContent = "Pause";

	mediaRecorder.start(10);

	var url = window.URL || window.webkitURL;
	videoElement.src = url ? url.createObjectURL(stream) : stream;
	videoElement.play();

	mediaRecorder.ondataavailable = function(e) {
		console.log('Data available...');
		console.log(e.data);
		console.log(e.data.type);
		console.log(e);
		chunks.push(e.data);
	};

	mediaRecorder.onerror = function(e){
		log('Error: ' + e);
		console.log('Error: ', e);
	};

	mediaRecorder.onstart = function(){
		log('Started & state = ' + mediaRecorder.state);
	};

	mediaRecorder.onstop = function(){
		log('Stopped  & state = ' + mediaRecorder.state);

		var blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"}); //video/webm
		chunks = [];

		var videoURL = window.URL.createObjectURL(blob);

		downloadLink.href = videoURL;
		videoElement.src = videoURL;
		downloadLink.innerHTML = 'Download video file';

		var rand =  Math.floor((Math.random() * 10000000));
		var name  = "video_"+rand+".webm" ;

		downloadLink.setAttribute( "download", name);
		downloadLink.setAttribute( "name", name);
	};

	mediaRecorder.onpause = function(){
		log('Paused & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onresume = function(){
		log('Resumed  & state = ' + mediaRecorder.state);
	}

	mediaRecorder.onwarning = function(e){
		log('Warning: ' + e);
	};
}

//function handleSourceOpen(event) {
//  console.log('MediaSource opened');
//  sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9"');
//  console.log('Source buffer: ', sourceBuffer);
//}

/*function onBtnRecordClicked() {
	if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
		alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	} else {
		navigator.getUserMedia(constraints, startRecording, errorCallback);
		recBtn.disabled = true;
		pauseResBtn.disabled = false;
		stopBtn.disabled = false;
	}
}*/

/*function onBtnStopClicked(){
	mediaRecorder.stop();
	videoElement.controls = true;
	recBtn.disabled = false;
	pauseResBtn.disabled = true;
	stopBtn.disabled = true;
}*/

/*function onPauseResumeClicked(){
	if (pauseResBtn.textContent === "Pause"){
		console.log("pause");
		pauseResBtn.textContent = "Resume";
		mediaRecorder.pause();
		stopBtn.disabled = true;
	} else {
		console.log("resume");
		pauseResBtn.textContent = "Pause";
		mediaRecorder.resume();
		stopBtn.disabled = false;
	}
	recBtn.disabled = true;
	pauseResBtn.disabled = false;
}*/

function log(message){
	// dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
}

//browser ID
function getBrowser() {
	console.log('function getBrowser() {');
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
			fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
		browserName = "Safari";
		fullVersion = nAgt.substring(verOffset+7);
		if ((verOffset=nAgt.indexOf("Version"))!=-1)
			fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
		browserName = "Firefox";
		fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
		browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
		fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
		fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
		fullVersion  = ''+parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion,10);
	}

	return browserName;
}

function handleSuccess(stream) {
	console.log('handleSuccess');
	var options;

	if (typeof MediaRecorder.isTypeSupported == 'function'){
		if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
			options = {mimeType: 'audio/webm;codecs=opus'};
		} else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
			options = {mimeType: 'audio/ogg;codecs=opus'};
		}
		console.log('audio/webm  '+options.mimeType);
		mediaRecorder = new MediaRecorder(stream, options);
	} else {
		console.log('this.recorder DEFAULT')
		mediaRecorder = new MediaRecorder(stream);
	}

	const recordedChunks = [];

	mediaRecorder.start(10);

	mediaRecorder.addEventListener('dataavailable', function(e) {
		if (e.data.size > 0) {
			recordedChunks.push(e.data);
			console.log(e.data);
		}

		if(shouldStop === true && stopped === false) {
			mediaRecorder.stop();
			stopped = true;
		}
	});

	mediaRecorder.addEventListener('start', function(e) {
		console.log('Started, state = ' + mediaRecorder.state);
	});

	mediaRecorder.addEventListener('stop', function() {
		audio1.src = URL.createObjectURL(new Blob(recordedChunks));
		downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
		downloadLink.download = 'acetest.wav';
	});

	mediaRecorder.addEventListener('warning', function(e) {
		log('Warning: ' + e);
	});

	mediaRecorder.addEventListener('error', evt => {
		console.log(evt);
		reject(evt);
	});
};

function checkMediaRecorder() {
	if (typeof MediaRecorder === 'undefined' || !navigator.getUserMedia) {
			alert('MediaRecorder not supported on your browser, use Firefox 30 or Chrome 49 instead.');
	}
};

function errorCallback (error) {
	alert(error);
	console.log('navigator.getUserMedia error: ', error);	
};

function start1() {
	navigator.getUserMedia({"audio": true, "video": false}, handleSuccess, errorCallback);
}

function start2() {
	navigator.getUserMedia(constraints)
		.then(startRecording)
		.catch(err => {console.log(err)});
}

function start3() {
	navigator.mediaDevices.getUserMedia({ video: false, audio: true }, handleSuccess, function(err){ console.log('Error '+err) });
}

function start4() {
	navigator.mediaDevices.getUserMedia(constraints, handleSuccess, errorCallback);
}

startButton1.addEventListener('click', start1);
startButton2.addEventListener('click', start2);
startButton3.addEventListener('click', start3);
startButton4.addEventListener('click', start4);

stopButton.addEventListener('click', function() {
	console.log('addEventListener(click');
	shouldStop = true;
})