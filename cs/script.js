  var videoElement = document.querySelector('#video1');
  var videoElement2 = document.querySelector('#video2');
  var audioElement = document.querySelector('#audio1');


  var audioSelect = document.querySelector('select#audioSource');
  var videoSelect = document.querySelector('select#videoSource');
  var videoSelect2 = document.querySelector('select#videoSource2');

 /* navigator.getUserMedia =  navigator.getUserMedia
  						||navigator.webkitGetUserMedia
  						||navigator.mozGetUserMedia;*/
  						
  navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
  .catch(errorCallback);

  function gotDevices(deviceInfos) {

  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    var option2 = document.createElement('option');
    option2.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audio') {
      option.text = deviceInfo.label ||
        'Microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } 
    else if (deviceInfo.kind === 'video') {
      option.text = deviceInfo.label || 'Camera ' +
        (videoSelect.length + 1);
      videoSelect.appendChild(option);
      option2.text = deviceInfo.label || 'Camera ' +
        (videoSelect2.length + 1);
      videoSelect2.appendChild(option);
    }
    }

  }

/*

FONCTIONS DEPRECIEES

  function gotSources(sourceInfos) {
    for (var i = 0; i !== sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      var option = document.createElement('option');
      var option2 = document.createElement('option');
      option.value = sourceInfo.id;
      option2.value = sourceInfo.id;
      if (sourceInfo.kind == 'audio') {
        option.text = sourceInfo.label || 'microphone ' + (audioSelect.length + 1);
        audioSelect.appendChild(option);
      }
      else if (sourceInfo.kind == 'video') {
        option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
        option2.text = sourceInfo.label || 'camera ' + (videoSelect2.length + 1);
        videoSelect2.appendChild(option2);
      }
  //    else {
  //      console.log('Some other kind of source: ', sourceInfo);
  //    }
    }
  }
  
  
  if (typeof MediaStreamTrack.getSources == 'undefined') {
    alert('This browser does not support MediaStreamTrack.\n\nTry Chrome version < 40.');
  } else {
    MediaStreamTrack.getSources(gotSources);
  }
  
  if (typeof MediaDevices.gotDevices == 'undefined') {
    alert('This browser does not support MediaSDevices.\n\nTry Chrome.');
  } else {
    MediaDevices.gotDevices(gotDevices);
  }*/




  function successCallback0(stream) {
    window.stream = stream; // make stream available to console
    audioElement.src = window.URL.createObjectURL(stream);
  }

  function successCallback1(stream) {
    window.stream = stream; // make stream available to console
    videoElement.src = window.URL.createObjectURL(stream);
    //videoElement.play();
  }

  function successCallback2(stream) {
  	  window.stream = stream; // make stream available to console
  	  videoElement2.src = window.URL.createObjectURL(stream);
  	  //videoElement.play();
  	}

  function errorCallback(error) {
    console.log('navigator.mediaDevices error: ', error);
  }


  function audio() {
    if (window.stream) {
      audioElement.src = null;
      window.stream.stop;
    }
    var audioSource = audioSelect.value;
    var constraints = {
      audio: {
        optional: [{
          sourceId: audioSource
        }]
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(successCallback0)
    .catch(errorCallback);
  }

  function video() {
  	  if (window.stream) {
  	    videoElement.src = null;
  	    window.stream.stop;
  	  }
  	  var videoSource = videoSelect.value;
  	  var constraints = {
  	    video: {
  	      optional: [{
  	        sourceId: videoSource
  	      }]
  	    }
  	  };
  	  navigator.mediaDevices.getUserMedia(constraints)
  	  .then(successCallback1)
  	  .catch(errorCallback);
  }

  function video2() {
  	  if (window.stream) {
  	    videoElement2.src = null;
  	    window.stream.stop;
  	  }
  	  var videoSource = videoSelect2.value;
  	  var constraints = {
  	    video: {
  	      optional: [{
  	        sourceId: videoSource
  	      }]
  	    }
  	  };
  	  navigator.mediaDevices.getUserMedia(constraints)
  	  .then(successCallback2)
  	  .catch(errorCallback);
  }

  audioSelect.onchange = audio1;
  videoSelect.onchange = video;
  videoSelect2.onchange = video2;

  audio();
  video();
  video2();
