import React, { useState } from 'react';
import { Signup } from '..';
import { Router, Link } from '@reach/router';
import api from '../../api-client';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onUsername = (e) => setUsername(e.target.value);
  const onPassword = (e) => setPassword(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      api.logUserIn(username, password)
        .then(res => console.log(res));
      setUsername('');
      setPassword('');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={onUsername}></input>
        <input type="password" value={password} onChange={onPassword}></input>
        <input type="submit" value="Login"></input>
      </form>
      <Link to="/signup"><button>Sign Up</button></Link>
    </div>
  );
}

export default Login;
