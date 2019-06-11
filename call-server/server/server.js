/* eslint-disable no-undef */
/* eslint-disable no-console */

const HTTPS_PORT = 8444;

const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// Yes, TLS is required
const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const httpsServer = http.createServer(serverConfig);
httpsServer.listen(HTTPS_PORT, '0.0.0.0');

// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
const wss = new WebSocketServer({server: httpsServer});

wss.on('connection', function(ws) {
  console.log('CONNECTED')

  ws.on('message', function(message) {
    // Broadcast any received message to all clients
    console.log('received: %s', message);
    wss.broadcast(message);
    // console.log('----------------------------------------------')
  });

  ws.on('error', function(error) {
    console.error(error);
  })
});

wss.broadcast = function(data) {
    this.clients.forEach(function(client) {
      if(client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
};

console.log('Server running. Visit https://localhost:' + HTTPS_PORT + ' in Firefox/Chrome.\n\n\
Some important notes:\n\
  * Note the HTTPS; there is no HTTP -> HTTPS redirect.\n\
  * You\'ll also need to accept the invalid TLS certificate.\n\
  * Some browsers or OSs may not allow the webcam to be used by multiple pages at once. You may need to use two different browsers or machines.\n'
);
