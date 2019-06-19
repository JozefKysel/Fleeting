const express = require('express');
const router = require('./router');
const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs');
const cors = require('cors');

const serverConfig = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
};
const PORT = 4001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const server = https.createServer(serverConfig, app);
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('outgoing call', data => socket.broadcast.emit('incoming call', data));
  socket.on('accepted call', data => io.emit('callLength', data));
  socket.on('message', message => socket.broadcast.emit('message', message));
  socket.on('error', error => console.log(error));
  socket.on('disconnect', () => process.env.NODE_ENV !== 'test' && console.log('Client disconnected'));
});

process.env.NODE_ENV !== 'test' && server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { server, app };
