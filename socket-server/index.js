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
  console.log('connection works');
  socket.on("outgoing call", (data) => {
    console.log(data);
    socket.broadcast.emit("incoming call", data);
  });
  socket.on('message', (message) => {
   console.log('this is the mesage', message);
   socket.broadcast.emit('message', message);
  });
  socket.on('error', e => {
   console.log(e);
  });
  socket.on("disconnect", () => console.log("Client disconnected"));
});




 //  socket.on("callee has answered", (data)=>{
 //     socket.broadcast.emit("render call pane on answer", data);
 //  });


server.listen(port, () => console.log(`Listening on port ${port}`));
