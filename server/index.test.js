const { server, app } = require('./index');
const db = require('./models');
const PORT = 4567;
const { createClient, mocks } = require('./utils');
const request = require('supertest');
const btoa = require('btoa');
let token;

beforeAll(done => server.listen(PORT, done));
afterAll(async done => {
  await request(app)
    .delete('/delete-account')
    .set({
      'Authorization': `Bearer ${token}`,
      'AuthorizationForDelete': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`
    });
  await db.MongoClient.close();
  server.close(done);
});


describe('Socket.io', () => {

  test('broadcasts a message from one client to another', async done => {
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

  test('broadcasts a call from one client to another', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const callLength = '00:05:00';
    
    client1.emit('outgoing call', callLength);

    client2.on('incoming call', data => {
      expect(data).toBe(callLength);
      client1.disconnect();
      client2.disconnect();
      done();
    });
  });

  test('broadcasts a call to all other clients connected', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const client3 = await createClient(PORT);
    const callLength = '00:05:00';

    client1.emit('outgoing call', callLength);

    client2.on('incoming call', data => {
      expect(data).toBe(callLength);
      client1.disconnect();
      client2.disconnect();
    });
    client3.on('incoming call', data => {
      expect(data).toBe(callLength);
      client3.disconnect();
      done();
    });
  });

  test('emits the call length to all clients connected', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const client3 = await createClient(PORT);
    const callLength = '00:05:00';

    client1.emit('accepted call', callLength);

    client1.on('callLength', data => {
      expect(data).toBe(callLength);
      client1.disconnect();
    });
    client2.on('callLength', data => {
      expect(data).toBe(callLength);
      client2.disconnect();
    });
    client3.on('callLength', data => {
      expect(data).toBe(callLength);
      client3.disconnect();
      done();
    });
  });

});


describe('API', () => {

  test('responds with HTTP 201 - /signup', () => {
    return request(app)
      .post('/signup')
      .send({
        authorization: `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`,
        email: mocks.user.email,
        gender: mocks.user.gender
      })
      .then(response => {
        // expect(response.body.userData.email).toBe(mocks.user.email);
        // expect(response.body.userData.username).toBe(mocks.user.username);
        // expect(response.body.userData.password).toBeDefined();
        // expect(typeof response.body.userData.password).toBe('string');
        // expect(response.body.userData.gender).toBe(mocks.user.gender);
        // expect(Array.isArray(response.body.userData.callLengths)).toBe(true);
        // expect(response.body.userData.callLengths.length).toBe(0);
        // expect(Array.isArray(response.body.userData.contacts)).toBe(true);
        // expect(response.body.userData.contacts.length).toBe(0);
        expect(response.statusCode).toBe(201);
      });
  });

  test('responds with HTTP 409 - /signup username already exists', () => {
    return request(app)
      .post('/signup')
      .send({
        authorization: `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`,
        email: mocks.user.email,
        gender: mocks.user.gender
      })
      .then(response => {
        expect(response.body.error).toBe('Username already exists');
        expect(response.statusCode).toBe(409);
      });
  });

  test.todo('responds with HTTP 200 - /signup account with this email already exists');

  test('responds with HTTP 200 - /login user', () => {
    return request(app)
      .post('/login')
      .set({
        'Authorization': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`
      })
      .then(response => {
        token = response.body.token;
        expect(response.body.token).toBeDefined();
        expect(response.statusCode).toBe(200);
      });
  });

  test('responds with HTTP 403 - /login badUser', () => {
    return request(app)
      .post('/login')
      .set({
        'Authorization': `Basic ${btoa(mocks.badUser.username + ':' + mocks.badUser.password)}`
      })
      .expect(403);
  });

  test.todo('new user after signup should appear in search');

  test.todo('should not be able to add a contact that is not in the db / search');


  test.todo('should not be able to add a contact that is already in the contacts');

});
