const { server, io, app } = require('./index');
const PORT = 4567;
const { createClient, mocks } = require('./utils');
const request = require('supertest');

beforeAll(async done => await server.listen(PORT, done));
afterAll(async done => await server.close(done));


describe('Socket.io', () => {

  test('server should be able to pass on a message from one client to another', async done => {
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

  test('server should be able to direct a call from one client to another', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const message = 'Client1 is calling you';
    
    client1.emit('outgoing call', message);
    client2.on('incoming call', data => {
      expect(data).toBe(message);
      client1.disconnect();
      client2.disconnect();
      done();
    });
  });

  // test('server should be able to log an error if one occurs', async done => {
  //   const client1 = await createClient(PORT);
  //   const error = Error('An error has occurred');
    
  //   client1.emit('error', error);
  //   io.on('connection', socket => {
  //     socket.on('error', data => expect(data).toBe(error));
  //     client1.disconnect();
  //     socket.disconnect();
  //     io.disconnect();
  //     done();
  //   });
  // });

});

describe('API', () => {

  test('server should respond with HTTP 201 - /signup', async () => {
    const response = await request(app).post('/signup');
    expect(response.statusCode).toBe(201);
  });

  test('server should respond with HTTP 200 - /login', async () => {
    const response = await request(app).post('/login');
    expect(response.statusCode).toBe(200);
  });

  test('server should respond with HTTP 200 - /home', async () => {
    const response = await request(app).get('/home');
    expect(response.statusCode).toBe(200);
  });

});
