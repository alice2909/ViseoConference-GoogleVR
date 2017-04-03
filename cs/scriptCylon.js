

var Cylon = require("cylon");
if (process.browser) {
  var BrowserLogger = require('./browser-logger'),
      logContainer = document.getElementById("log");
      var fb =document.getElementById('tiltFB').innerHTML;
      var lr =document.getElementById('tiltLR').innerHTML;
  console.log("Setting logger!");
  Cylon.Logger.setup({
    logger: BrowserLogger(logContainer),
    level: 'debug'
  });
}
Cylon.robot({
  connections: {
    arduino: { adaptor: "firmata", port: "/dev/ttyACM0" }
  },

  devices: {
    led: { driver: "led", pin: 17 },
    servo1: { driver: "servo", pin: 3, range: { min: 30, max: 150 } }, 
    servo2: { driver: "servo", pin: 5, range: { min: 30, max: 150 } }
  },

  work: function(my) {
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
}).start();