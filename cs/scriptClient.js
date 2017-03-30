var remoteVideo = document.querySelector('#remoteVideo');
var remoteVideo1 = document.querySelector('#remoteVideo1');

function onOpen(event) {
  document.getElementById('messages').innerHTML = 'Connection established';
}

function onError(event) {
  document.getElementById('messages').innerHTML += '<br/>'+event.data;
}


var pc;

function errorCallback(error) {
  console.log('navigator.mediaDevices error: ', error);
}


function start() {
  
  var webSocket =new WebSocket("wss://192.168.43.253:5568");
  
  webSocket.onopen = function(event) {
    onOpen(event);
  };
  
  webSocket.onerror = function(event) {
    onError(event);
  };
  
  webSocket.onclose=function(event){
    alert(event.data);
  };
  
  var iceServer = {
    "iceServers": [{
    "url": "stun:stun.l.google.com:19302"
    }]
  };
  
  
  pc = new webkitRTCPeerConnection(iceServer);
  // pc = new RTCPeerConnection(iceServer);
  hasAddTrack = (pc.addTrack !== undefined);
  //pc.onaddstream = function(event){
  console.log(hasAddTrack);
  
  pc.onaddstream = function(event){
    //alert(event.stream.getTracks().length);
    event.stream.getVideoTracks()[0].enabled = true;
    event.stream.getVideoTracks()[1].enabled = true;
    
    console.log('esgt',event.stream.getTracks());
    var remoteMedia1 = new webkitMediaStream();
    var remoteMedia2 = new webkitMediaStream();
    
    console.log('remoteMedia1',remoteMedia1);               
    console.log('remoteMedia2',remoteMedia2); 
    
    remoteMedia1.addTrack(event.stream.getVideoTracks()[0]);
    remoteMedia2.addTrack(event.stream.getVideoTracks()[1]);
    
    document.getElementById('remoteVideo').src = window.URL.createObjectURL(remoteMedia1);
    document.getElementById('remoteVideo1').src = window.URL.createObjectURL(remoteMedia2);
  };
  
  
  function send(message) {
    waitForConnection(function () {
       webSocket.send(message);
      }, 1000);
  };
  
  function waitForConnection(callback, interval) {
    if (webSocket.readyState === 1) {
      callback();
    } else {
      setTimeout(function () {
          waitForConnection(callback, interval);
        }, interval);
    }
  };
  
  var sendOfferFn = function(desc){
    //alert(desc.sdp)
    //pc.setRemoteDescription(desc);
    pc.setLocalDescription(desc);
    
    send(JSON.stringify({
      "event": "_offer",
      "data": {
        "sdp": desc
      }
    }));
  };
  
  
  
  pc.onicecandidate = function(event){
    if (event.candidate !== null) {
      webSocket.send(JSON.stringify({
        "event": "_ice_candidate",
        "data": {
          "candidate": event.candidate
        }
      }));
    }
  };
  
  
  var sendAnswerFn = function(desc){
    pc.setLocalDescription(desc);
    webSocket.send(JSON.stringify({
      "event": "_answer",
      "data": {
        "sdp": desc
      }
    }));
  };
  
  
  
  webSocket.onmessage = function(event){
    var jsonstr="'"+event.data+"'"
    var json = JSON.parse(event.data);
    console.log('onmessage: ', json);
    
    switch(json.event){
      
      case "_ice_candidate":
        pc.addIceCandidate(new RTCIceCandidate(json.data.candidate))
          .then()
          .catch(function(reason) {console.log('Error: Failure during addIceCandidate(): '+reason+' here.'); });
        break;
      
      case "_offer" : 
        pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp))
          .then(function(){
            pc.createAnswer().then(sendAnswerFn)
              .then()
              .catch(function (error) {
                alert("error1");
                console.log('Failure callback: ' + error);
              });
          })
          .catch(function(){
            pc.createAnswer().then(sendAnswerFn)
              .then()
              .catch(function (error) {
                alert("error");
                console.log('Failure callback: ' + error);
              });
          });
        break;
      
      default : 
        console.log("Unknown message received:");
        console.log(msg);
    }
    
  }
  
  //we check if deviceorientation is supported by the apparatus
  if(window.DeviceOrientationEvent){
    console.log("DeviceOrientation is supported");
    
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      // gamma is the left-to-right tilt in degrees, where right is positive
      // beta is the front-to-back tilt in degrees, where front is positive
      // alpha is the compass direction the device is facing in degrees
      var tiltLR = eventData.gamma;
      var tiltFB = eventData.beta;
      var dir = eventData.alpha;
      
      send(JSON.stringify({
        "event": "_position",
        "data": {
          "x": tiltLR,
          "y": tiltFB,
          "z": dir
        }
      }));
      
      }, false);
  } 
  else {
    console.log("DeviceOrientation isn't supported, unnable to send the position");
  }

}
