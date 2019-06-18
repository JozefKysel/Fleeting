const { server, io, app } = require('./index');
const PORT = 4567;
const { createClient, mocks } = require('./utils');
const request = require('supertest');
const btoa = require('btoa');

beforeAll(async done => await server.listen(PORT, done));
afterAll(async done => await server.close(done));
// close db and socket


describe('Socket.io', () => {

  test('server broadcasts a message from one client to another', async done => {
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

  test('server broadcasts a call from one client to another', async done => {
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

  test.todo('broadcasts the call to all clients connected')

});

describe('API', () => {

  test('server responds with HTTP 201 - /signup', () => {
    return request(app)
      .post('/signup')
      .send(mocks.user.email, mocks.user.gender)
      .set({ 'Authorization': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`})
      .then(response => expect(response.statusCode).toBe(201));
  });

  test('server responds with HTTP 200 - /login', () => {
    return request(app)
      .post('/login')
      .set({ 'Authorization': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`})
      .then(response => expect(response.statusCode).toBe(200));
  });

  test('server responds with HTTP 403 - /login', () => {
    return request(app)
      .post('/login')
      .set({ 'Authorization': `Basic ${btoa(mocks.badUser.username + ':' + mocks.badUser.password)}`})
      .then(response => expect(response.statusCode).toBe(403));
  });

  test.todo('new user after signup should appear in search');

  test.todo('should not be able to add a contact that is not in the db / search');

  test.todo('should not be able to sign up with a username that already exists');

  test.todo('should not be able to add a contact that is already in the contacts');

});
