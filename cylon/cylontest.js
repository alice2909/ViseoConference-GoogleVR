var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
//     console.log('Un client est connecté !');
// });

//console.log('work!');
server.listen(9000);


io.sockets.on('connection', function (socket) {
console.log('Un client est connecté !');
socket.on('message', function(message) {
      console.log("in");
      var jsonstr = JSON.stringify(message);
      console.log('Le serveur a un message pour vous : ' + jsonstr);
    })
});


'use strict';

var Cylon = require('cylon');
var io = require('socket.io').listen(server);


Cylon.robot({
//  name: 'rosie',

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    servo1: { driver: "servo", pin: 3, range: { min: 30, max: 150 } }, 
    servo2: { driver: "servo", pin: 5, range: { min: 30, max: 150 } }
  },

  work: function(my) {
    // for this example with sockets
    // we are going to be interacting
    // with the robot using the code in
    // ./**-client.html
    console.log('work!');
    io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.on('message', function(message) {
          console.log("in");
          var jsonstr = JSON.stringify(message);
          console.log('Le serveur a un message pour vous : ' + jsonstr);
        })
    });
    my.led.turnOn();
    my.servo1.angle(50);
    my.servo2.angle(50);
    console.log("Current Angle: " + (my.servo1.currentAngle()));
    console.log("Current Angle: " + (my.servo2.currentAngle()));
    every((1).seconds(), function() {
      my.servo1.angle(my.servo1.currentAngle()+20);
      my.servo2.angle(my.servo2.currentAngle()+20);
    });
  }
});

// ensure you install the API plugin first:
// $ npm install cylon-api-socket-io
// Cylon.api('socketio',
// {
//   host: '192.168.1.3',
//   port: '9000'
// });

Cylon.start();
