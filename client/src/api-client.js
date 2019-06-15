const btoa = require('btoa');

exports.saveUser = (username, password, email) => {
  fetch('https://localhost:4001/login', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(username:password)}`
    },
    body: {
      email: JSON.stringify(email),
      gender: JSON.stringify(gender)
    }
  });
};
