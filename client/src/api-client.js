const btoa = require('btoa');

exports.saveUser = (username, password, email, gender) => fetch('https://localhost:4001/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    authorization: `Basic ${btoa(username + ':' + password)}`,
    email: email,
    gender: gender
  })
});

exports.addContact = (username, contact) => fetch(`https://localhost:4001/add/${username}`, {
  method: 'PUT',
  body: JSON.stringify(contact),
  headers: {
    'Authorization': `Bearer: ${window.localStorage.getItem('access_token')}`,
    'Content-Type': 'application/json'
  }
});

exports.logUserIn = (username, password) => fetch('https://localhost:4001/login', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(username + ':' + password)}`
  }
});

exports.getUserData = (email) => fetch(`https://localhost:4001/user/${email}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`,
  }
});

exports.searchForUsers = (username) => fetch(`https://localhost:4001/search/${username}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`
  }
});
