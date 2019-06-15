const btoa = require('btoa');

exports.saveUser = (username, password, email, gender) => {
  fetch('https://localhost:4001/signup', {
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
};
