function onOpen(event) {
    document.getElementById('messages').innerHTML
      = 'Connection established';
}

function onError(event) {
     document.getElementById('messages').innerHTML
        += '<br/>'+event.data;
}

var newstream = new webkitMediaStream();

var iceServer = { "iceServers": [{"url": "stun:stun.l.google.com:19302"}] };


function start() {
    var webSocket =new WebSocket("wss://192.168.43.253:5568");
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

    var pc = new webkitRTCPeerConnection(iceServer);
    
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
  	    .then(successCallback3)
  	    .catch(errorCallback);
        //navigator.getUserMedia(constraints, successCallback3, errorCallback);
    }

    function successCallback3(stream) {
        console.log('stream', stream.getVideoTracks()[0]);
        newstream.addTrack(stream.getVideoTracks()[0]);
        //pc.addStream(stream);
        //alert("video1");
    }

    function remotevideo1() {
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
            .then(successCallback4)
            .catch(errorCallback);
        //navigator.getUserMedia(constraints, successCallback4, errorCallback);
    }
    
    function successCallback4(stream) {
        newstream.addTrack(stream.getVideoTracks()[0]);
        pc.addStream(newstream);
        console.log('stream', newstream);
        console.log('stream', newstream.getVideoTracks()[0]);
        console.log('stream', newstream.getVideoTracks()[1]);
        pc.createOffer()
            .then(sendOfferFn)
            .catch(function (error) {
                console.log('Failure callback: ' + error);
            });
        //alert("video2");
        //var k = newstream.getTracks().length;
        //alert(newstream.getTracks().length);
    }

    remotevideo();
    remotevideo1();
    //remoteaudio();
    function getposition(data){
      
      console.log('x= ',data.x);
      console.log('y= ',data.y);
      console.log('z= ',data.z);
      
      document.getElementById('tiltLR').text = data.x;
      document.getElementById('tiltFB').text = data.y;
      document.getElementById('dir').text = data.z;
      
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
        //If it is an ICE candidate, it will be added to the PeerConnection, or set the other side of the session described as a pass over the description
       
    };  
    
  }
