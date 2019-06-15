const express = require("express");
const https = require('https');
const socketIo = require("socket.io");
const client = require('socket.io-client');
const fs = require('fs');

const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};

const port = 4001;
let app;
let server;
let io;

beforeAll(done => {
  // app = express();
  // server = https.createServer(serverConfig, app).listen();
  server = https.createServer().listen();
  io = socketIo(server);
  done();
});

afterAll(done => {
  io.close();
  server.close();
  done();
});

beforeEach(done => {
  socket = client.connect(`https://localhost:${port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket']
  });
  socket.on('connect', () => done());
});

afterEach(done => {
  if (socket.connected) socket.disconnect();
  done();
});

const add = (a, b) => a + b;

describe('First', () => {
  test('1 plus 1 equals 2', () => {
    expect(add(1, 1)).toBe(2)
  });
  

});