/*"use strict";
  var fb;
  var lr;
  
  var Cylon = require("Cylonjs");
  
  
  Cylon.robot({
    
    connections: {
      arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
    },
  
    devices: {
      led: { driver: "led", pin: 17 },
      servo: { driver: "servo1", pin: 3, range: { min: 30, max: 150 } }, 
      servo: { driver: "servo2", pin: 5, range: { min: 30, max: 150 } }
    },
  
    work: function(my) {
      my.led.turnOn();
      console.log("Current Angle: " + (my.servo1.currentAngle()));
      console.log("Current Angle: " + (my.servo2.currentAngle()));
      every((1).seconds(), function() {
        my.servo1.angle(fb);
        my.servo2.angle(lr);
      });
    }
  }).start();*/
  
  
function start() {

  
  function onOpen(event) {
      document.getElementById('messages').innerHTML = 'Connection established';
  }
  
  function onError(event) {
       document.getElementById('messages').innerHTML += '<br/>'+event.data;
  }
  
  var webSocket =new WebSocket("wss://192.168.43.253:5568");
  var iceServer = { "iceServers": [{"url": "stun:stun.l.google.com:19302"}] };
  var pc = new webkitRTCPeerConnection(iceServer);
  var newstream = new webkitMediaStream();

  webSocket.onopen = function(event) {
      onOpen(event);
  };
  webSocket.onerror = function(event) {
      onError(event);
  };
  
  webSocket.onclose=function(event){
      //document.getElementById('messages').innerHTML
      //+= '<br/>'+str(event.data);
      alert(event.data)
  }
  
  
  
  function send(message) {
      waitForConnection(function () {webSocket.send(message);}, 1000);
  };
  
  function waitForConnection(callback, interval) {
      if (webSocket.readyState === 1) {
          callback();
      } 
      else {
          //var that = this;
          // optional: implement backoff for interval here
          setTimeout(function () {
              waitForConnection(callback, interval);
          }, interval);
      }
  };
  
  var sendOfferFn = function(desc){
      //desc.sdp = setSDPStereo(desc.sdp);
      pc.setLocalDescription(desc);
      send(JSON.stringify({
          "event": "_offer",
          "data": {
              "sdp": desc
          }
      }));
  };
  
  var sendAnswerFn = function(desc){
      //desc.sdp = setSDPStereo(desc.sdp);
      pc.setLocalDescription(desc);
      webSocket.send(JSON.stringify({
          "event": "_answer",
          "data": {
              "sdp": desc
          }
      }));
  };
  
  
  pc.ondatachannel = function(event){
      console.trace('Receive Channel Callback');
      pc = event.channel;
      pc.onmessage = onReceiveMessageCallback;
  }
  
  function onReceiveMessageCallback(event){
      console.trace('Received Message: '+event.data);
      //dataChannelReceive.value = event.data;
  }
  
  
  
  pc.onicecandidate = function(event){
      if (event.candidate !== null) {
          send(JSON.stringify({
              "event": "_ice_candidate",
              "data": {
                  "candidate": event.candidate
              }
          }));
      }
  };
  
  
  
  
  function remotevideo() {
     /*  if (window.stream) {
         videoElement.src = null;
         window.stream.stop;
       }*/
      var videoSource = videoSelect.value;
      var constraints = {
          video: {
              optional: [{
              sourceId: videoSource
              }]
          }
      };
       navigator.mediaDevices.getUserMedia(constraints)
      .then(successCallback3)
      .catch(errorCallback);
  }
  
  function successCallback3(stream) {
      //console.log('stream', stream.getVideoTracks()[0]);
      newstream.addTrack(stream.getVideoTracks()[0]);
      //pc.addStream(stream);
      //alert("video1");
  }
  
  function remotevideo1() {
      /* if (window.stream) {
         videoElement2.src = null;
         window.stream.stop;
       }*/
      var videoSource = videoSelect2.value;
      var constraints = {
          video: {
              optional: [{
                  sourceId: videoSource
              }]
          }
      };
      navigator.mediaDevices.getUserMedia(constraints)
          .then(successCallback4)
          .catch(errorCallback);
  }
  
  function successCallback4(stream) {
      newstream.addTrack(stream.getVideoTracks()[0]);
      pc.addStream(newstream);
      //console.log('stream', newstream);
      //console.log('stream', newstream.getVideoTracks()[0]);
      //console.log('stream', newstream.getVideoTracks()[1]);
      pc.createOffer()
          .then(sendOfferFn)
          .catch(function (error) {
              console.log('Failure callback: ' + error);
          });
  }
  
  remotevideo();
  remotevideo1();
  //remoteaudio();


  function getposition(data){
    fb=data.y;
    lr=data.x;
    document.getElementById('tiltLR').innerHTML= data.x;
    document.getElementById('tiltFB').innerHTML = data.y;
    document.getElementById('dir').innerHTML = data.z;
    
  }
  
  //Handle incoming signaling
  webSocket.onmessage = function(event){
      //alert(event.data);
      //document.getElementById('messages').innerHTML
      // += '<br/>'+event.data;
      var jsonstr="'"+event.data+"'";
      var json = JSON.parse(event.data);
      console.log('onmessage: ', json);
      
      switch(json.event){
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
        case "_answer":
          pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp),function(){},function(){});
          break;
        case "_ice_candidate": 
          pc.addIceCandidate(new RTCIceCandidate(json.data.candidate));
          break;
        case "_position":
          getposition(json.data);
          break;
        default: 
        
      }
  };  
  
}
