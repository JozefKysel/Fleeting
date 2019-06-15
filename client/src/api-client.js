const btoa = require('btoa');

exports.saveUser = (username, password, email) => {
  fetch('https://localhost:4001/login', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(username:password)}`
    },
    body: JSON.stringify(email);
  });
};
