const { server, app } = require('./index');
const db = require('./models');
const PORT = 4567;
const { createClient, mocks } = require('./utils');
const request = require('supertest');
const btoa = require('btoa');
let token;
let testToken;
const userModels = require('./models/users');

beforeAll(async done => {
  server.listen(PORT);
  
  await request(app)
    .post('/signup')
    .send({
      authorization: `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`,
      email: mocks.testUser.email,
      gender: mocks.testUser.gender
    });

  await request(app)
    .post('/login')
    .set({
      'Authorization': `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`
    })
    .then(response => {
      testToken = response.body.token;
  });

  done();
});

afterAll(async done => {
  await request(app)
    .delete('/delete-account')
    .set({
      'Authorization': `Bearer ${testToken}`,
      'AuthorizationForDelete': `Basic ${btoa(mocks.testUser.username + ':' + mocks.testUser.password)}`
    });

  await server.close();
  await db.MongoClient.close();
  done();
});


describe('Socket.io', () => {

  test('broadcasts a message from one client to another', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const message = 'hello world';
    
    client2.on('message', data => {
      expect(data).toBe(message);
      client1.disconnect();
      client2.disconnect();
      done();
    });

    client1.emit('message', message);
  });

  test('broadcasts a call from one client to another', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const callLength = '00:05:00';

    client2.on('incoming call', data => {
      expect(data).toBe(callLength);
      client1.disconnect();
      client2.disconnect();
      done();
    });
    
    client1.emit('outgoing call', callLength);
  });

  test('broadcasts a call to all other clients connected', async done => {
    const client1 = await createClient(PORT);
    const client2 = await createClient(PORT);
    const client3 = await createClient(PORT);
    const callLength = '00:05:00';
    let countReceived = 0;
    let client1Received = false;

    client1.on('incoming call', () => {
      client1Received = true;
    });
    client2.on('incoming call', data => {
      expect(data).toBe(callLength);
      countReceived ++;
    });
    client3.on('incoming call', data => {
      expect(data).toBe(callLength);
      countReceived ++;
    });

    client1.emit('outgoing call', callLength);

    setTimeout(() => {
      countReceived === 2 && ! client1Received
        && client1.disconnect() && client2.disconnect() && client3.disconnect()
        && done();
    }, 200);
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


describe('UserModel', () => {

  test('.set creates a new db document in collection users', async done => {
    const { email, username, password, gender } = mocks.user;
    const result = await userModels.set(email, username, password, gender);
    expect(result.ops[0].email).toBe(email);
    expect(result.ops[0].username).toBe(username);
    expect(result.ops[0].gender).toBe(gender);
    expect(result.ops[0].callLengths.length).toBe(0);
    expect(result.ops[0].contacts.length).toBe(0);
    expect(result.ops[0]._id).toBeDefined();
    done();
  });

  test('.getByEmail finds one in collection users by email address', async done => {
    const { email, username, password, gender } = mocks.user;
    const result = await userModels.getByEmail(email);
    expect(result.email).toBe(email);
    expect(result.username).toBe(username);
    expect(result.gender).toBe(gender);
    expect(result.callLengths.length).toBe(0);
    expect(result.contacts.length).toBe(0);
    expect(result._id).toBeDefined();
    done();
  });

  test('.getByUsername finds one in collection users by username', async done => {
    const { email, username, password, gender } = mocks.user;
    const result = await userModels.getByUsername(username);
    expect(result.email).toBe(email);
    expect(result.username).toBe(username);
    expect(result.gender).toBe(gender);
    expect(result.callLengths.length).toBe(0);
    expect(result.contacts.length).toBe(0);
    expect(result._id).toBeDefined();
    done();
  });

  test('.getSearch finds all in collection users whose usernames match a string (case insensitive)', async done => {
    const string = 'user';
    const result = await userModels.getSearch(string);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result.some(user => user.username === mocks.testUser.username)).toBeDefined();
    expect(result.some(user => user.username === mocks.user.username)).toBeDefined();
    done();
  });

  test('.updateContacts finds one in collection users and adds a new user to its contacts', async done => {
    await userModels.updateContacts(mocks.user.email, mocks.testUser);
    const result = await userModels.getByEmail(mocks.user.email);
    expect(Array.isArray(result.contacts)).toBe(true);
    expect(result.contacts.length).toBe(1);
    expect(result.contacts.some(user => user.username === mocks.testUser.username)).toBeDefined();
    done();
  });

  test('.deleteUser deletes one in collection users', async done => {
    await userModels.deleteUser(mocks.user.username);
    const result = await userModels.getByUsername(mocks.user.username);
    expect(result).toBe(null);
    done();
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
  
  test('responds with HTTP 200 - /search/:username 🕵️‍♂️ ', () => {
    return request(app)
      .get(`/search/${mocks.user.username}`)
      .set({
        'Authorization': `Bearer ${testToken}`
      })
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some(user => user.username === mocks.user.username)).toBe(true);
        expect(response.body.find(user => user.username === mocks.testUser.username)).toBe(undefined);
        expect(response.statusCode).toBe(200);
      });
  });

  test('responds with HTTP 200 - /add/:username 👫 ', () => {
    return request(app)
      .put(`/add/${mocks.user.username}`)
      .set({
        'Authorization': `Bearer ${testToken}`
      })
      .send(mocks.user)
      .then(response => {
        expect(Array.isArray(response.body.contacts)).toBe(true);
        expect(response.body.contacts.some(user => user.username === mocks.user.username)).toBe(true);
        expect(response.statusCode).toBe(200);
      });
  });

  test('responds with HTTP 409 - /add/:username 👫 user in contacts', () => {
    return request(app)
      .put(`/add/${mocks.user.username}`)
      .set({
        'Authorization': `Bearer ${testToken}`
      })
      .send(mocks.user)
      .expect(409);
  });

  test('responds with HTTP 409 - /add/:username 👫 self', () => {
    return request(app)
      .put(`/add/${mocks.testUser.username}`)
      .set({
        'Authorization': `Bearer ${testToken}`
      })
      .send(mocks.testUser)
      .expect(409);
  });
  
  test(`responds with HTTP 403 - /add/:badUsername 🕴  user doesn't exist`, () => {
    return request(app)
      .put(`/add/${mocks.badUser.username}`)
      .set({
        'Authorization': `Bearer ${testToken}`
      })
      .send(mocks.badUser)
      .expect(404);
  });

  test('responds with HTTP 200 - /delete-account ✔︎ ', () => {
    return request(app)
      .delete('/delete-account')
      .set({
        'Authorization': `Bearer ${token}`,
        'AuthorizationForDelete': `Basic ${btoa(mocks.user.username + ':' + mocks.user.password)}`
      })
      .expect(200);
  });
  
});
