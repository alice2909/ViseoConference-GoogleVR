var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('ssl/device.key', 'utf8');
var certificate = fs.readFileSync('ssl/device.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// your express configuration here

var httpsServer = https.createServer(credentials);


var WebSocketServer = require('ws').Server;
var clients = [];

//var server = http.createServer();
httpsServer.listen(5568, function() {
  console.log((new Date()) + " Server is listening on port 5568");
});
//made a second port for the data motion of the phone
httpsServer.listen(5500, function() {
  console.log((new Date()) + " Server is listening on port 5500");
});

// create the server
wsServer = new WebSocketServer({
    server : httpsServer
});

// create the second server
MobileToPc = new WebSocketServer({
    server : httpsServer
});

function sendCallback(err) {
    if (err) console.error("send() error: " + err);
}

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('connection', function(ws) {
    console.log((new Date()) + ' Connection from origin ' + ws + '.');
    //console.log(ws);
    /*var connection = request.accept(null, request.origin);
    console.log(' Connection ' + connection.remoteAddress);*/
    clients.push(ws);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    ws.on('message', function(message) {
    	console.log(message);
        //if (message.type === 'utf8') {
            // process WebSocket message
            console.log((new Date()) + ' Received Message ' + message);
            // broadcast message to all connected clients
            clients.forEach(function (outputConnection) {
                if (outputConnection != ws) {
                  outputConnection.send(message, sendCallback);
                }
            });
        //}
    });

    ws.on('close', function(connection) {
        // close user connection
        clients = clients.filter(item => item !== connection);
        console.log((new Date()) + " Peer disconnected.");
    });
});


MobileToPc.on('connection', function(mp) {
    console.log((new Date()) + ' Connection from origin ' + mp + '.');
    //console.log(ws);
    /*var connection = request.accept(null, request.origin);
    console.log(' Connection ' + connection.remoteAddress);*/
    clients.push(mp);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    mp.on('message', function(message) {
    	console.log(message);
        //if (message.type === 'utf8') {
            // process WebSocket message
            console.log((new Date()) + ' Received Message ' + message);
            // broadcast message to all connected clients
            clients.forEach(function (outputConnection) {
                if (outputConnection != mp) {
                  outputConnection.send(message, sendCallback);
                }
            });
        //}
    });

    mp.on('close', function(connection) {
        // close user connection
        clients = clients.filter(item => item !== connection);
        console.log((new Date()) + " Peer disconnected.");
    });
});
//declare a buffer object 
//deprécié
//var data=new ArrayBuffer(64);
//var close_connection=true;
// on cree une connexion udp entre le client et le server.
//we create the socket 
	/*if(chrome.sockets){
		chrome.sockets.udp.create( "udp", function callback{console.log("chrome.socket is supported \t");});
		//we bind the port with the ip adress of the server
		 chrome.sockets.udp.bind(1, "192.168.43.253", 5060, function(var result) {
									if(result<0)console.log("bind error");
									else { console.log("successful bind");});
		//waiting for a client to connect to the server:
		chrome.socket.listen(1, "192.168.43.253", 5060, function{console.log{"server listening "} });
		//accept the connection
		chrome.socket.accept(1, function{ console.log("accept the connection ") });
		//while(close_connection){
			//now start reading the informations "the reading buffer size is optional"
			chrome.socket.read(1, function (data ){console.log ("reading data ")});
			console.log("display data ");
			data.console.log;
		//}
		
		//
	}
	else {
		console.log("chrome.socket is not supported !!!! \t");
	}*/




