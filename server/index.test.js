const server = require('./index');
const PORT = 4001;
const { createClient } = require('./utils');

beforeAll(async done => await server.listen(PORT, done));
afterAll(async done => await server.close(done));


describe('Socket.io', () => {

  test('server should be able to broadcast a message received from a client to other clients', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const message = 'hello world';
    
    client1.emit('message', message);
    client2.on('message', data => {
      expect(data).toBe(message);
      client1.disconnect();
      client2.disconnect();
      done();
    });
  });

  test('server should be able to direct a call from one client to the other', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    
    client1.emit('outgoing call', 'Client1 is calling you');
    client2.on('incoming call', data => {
      expect(data).toBe('Client1 is calling you');
      client1.disconnect();
      client2.disconnect();
      done();
    });
  });

  test('server should be able to log an error if one occurs', () => {
    // don't know how to test this
  });

});
