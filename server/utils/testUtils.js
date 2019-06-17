const client = require('socket.io-client');

const createClient = PORT => {
  return new Promise((resolve, reject) => {
    const socket = client.connect(`https://localhost:${PORT}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket']
    });
    socket.on('connect', () => resolve(socket));
    socket.on('error', reject);
  })
};

module.exports = createClient;