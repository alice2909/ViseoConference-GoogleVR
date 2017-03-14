 var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('ssl/device.key', 'utf8');
var certificate = fs.readFileSync('ssl/device.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(5000, function() {
  console.log((new Date()) + " Server is listening on port 5000");
});
//httpsServer.listen(8443);
 

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendfile('index.htm')
 });

  app.post("/user/add", function(req, res) { 
	/* some server side logic */
	res.send("OK");
  });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });

 /*var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });*/
