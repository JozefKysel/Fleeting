/* eslint-disable no-undef */
/* eslint-disable no-console */

const express = require("express");
const https = require('https');
const socketIo = require("socket.io");
const fs = require('fs');

const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const port = 4001;
const app = express();
const server = https.createServer(serverConfig, app);
const io = socketIo(server);


io.on("connection", socket => {

  socket.on("outgoing call", data => socket.broadcast.emit("incoming call", data));

  socket.on('message', message => socket.broadcast.emit('message', message));

  socket.on('error', error => console.log(error));

  socket.on("disconnect", () => console.log("Client disconnected"));
});


server.listen(port, () => console.log(`Listening on port ${port}`));
