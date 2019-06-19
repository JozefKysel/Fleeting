const { server, app } = require('./index');
const db = require('./models');
const PORT = 4567;
const { createClient, mocks } = require('./utils');
const request = require('supertest');
const btoa = require('btoa');
let token;
// let testToken;

beforeAll(done => {
  server.listen(PORT);
  
  // await request(app)
  //   .post('/signup')
  //   .send({
  //     authorization: `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`,
  //     email: mocks.testUser.email,
  //     gender: mocks.testUser.gender
  //   });

  // await request(app)
  //   .post('/login')
  //   .set({
  //     'Authorization': `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`
  //   })
  //   .then(response => {
  //     testToken = response.body.token;
  // });

  done();
});

afterAll(async done => {
  // await request(app)
  //   .delete('/delete-account')
  //   .set({
  //     'Authorization': `Bearer ${testToken}`,
  //     'AuthorizationForDelete': `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`
  //   });

  await server.close();
  await db.MongoClient.close();
  done();
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

  test('responds with HTTP 201 - /signup 🚀', () => {
    return request(app)
      .post('/signup')
      .send({
        authorization: `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`,
        email: mocks.user.email,
        gender: mocks.user.gender
      })
      .then(response => {
        expect(response.body.userData.email).toBe(mocks.user.email);
        expect(response.body.userData.username).toBe(mocks.user.username);
        expect(response.body.userData.password).toBeDefined();
        expect(typeof response.body.userData.password).toBe('string');
        expect(response.body.userData.gender).toBe(mocks.user.gender);
        expect(Array.isArray(response.body.userData.callLengths)).toBe(true);
        expect(response.body.userData.callLengths.length).toBe(0);
        expect(Array.isArray(response.body.userData.contacts)).toBe(true);
        expect(response.body.userData.contacts.length).toBe(0);
        expect(response.statusCode).toBe(201);
      });
  });

  test('responds with HTTP 409 - /signup 🚀 username already exists', () => {
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
    
  test('responds with HTTP 200 - /signup 🚀 email address already exists', () => {
    return request(app)
      .post('/signup')
      .send({
        authorization: `Basic ${btoa(mocks.badUser.username + ':' + mocks.badUser.password)}`,
        email: mocks.user.email,
        gender: mocks.badUser.gender
      })
      .then(response =>{
        expect(response.body.error).toBe('There already is an account connected to this email address');
        expect(response.statusCode).toBe(200);
      });
  });
  
  test('responds with HTTP 200 - /login 🔑 user', () => {
    return request(app)
      .post('/login')
      .set({
        'Authorization': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`
      })
      .then(response => {
        expect(response.body.token).toBeDefined();
        token = response.body.token;
        expect(response.statusCode).toBe(200);
      });
  });
  
  test('responds with HTTP 403 - /login 🔑 badUser', () => {
    return request(app)
    .post('/login')
    .set({
      'Authorization': `Basic ${btoa(mocks.badUser.username + ':' + mocks.badUser.password)}`
    })
    .expect(403);
  });
  
  test.todo('responds with HTTP 200 - /search/:mocks.user.username 🕵️‍♂️');

  test.todo('responds with HTTP 200 - /add/:mocks.user.username 👫');
  
  test.todo('responds with HTTP 409 - /add/:mocks.user.username 👫 user in contacts');
  
  test.todo(`responds with HTTP 403 - /add/:mocks.badUser.username 🕴  user doesn't exist`);

  test('responds with HTTP 200 - /delete-account ✔︎', () => {
    return request(app)
      .delete('/delete-account')
      .set({
        'Authorization': `Bearer ${token}`,
        'AuthorizationForDelete': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`
      })
      .expect(200);
  });
  
});
