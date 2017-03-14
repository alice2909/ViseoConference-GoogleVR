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

// create the server
wsServer = new WebSocketServer({
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
