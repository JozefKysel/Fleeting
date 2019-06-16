const btoa = require('btoa');

exports.saveUser = (username, password, email, gender) => fetch('https://localhost:4001/signup', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(username + ':' + password)}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: email,
    gender: gender
  })
});

exports.addContact = (username, contact) => fetch(`https://localhost:4001/add/${username}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer: ${window.localStorage.getItem('access_token')}`
  },
  body: JSON.stringify({newContact: contact})
})

exports.logUserIn = (username, password) => fetch('https://localhost:4001/login', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(username + ':' + password)}`
  }
});

exports.searchForUsers = (username) => fetch(`https://localhost:4001/search/${username}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${window.localStorage.getItem('access_token')}`
  }
});
