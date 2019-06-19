import React, { useState } from 'react';
import api from '../../api-client';
import { Redirect, Link } from 'react-router-dom';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [access_token, setToken] = useState('');
  const [user, setUser] = useState({});

  const onUsername = (e) => setUsername(e.target.value);
  const onPassword = (e) => setPassword(e.target.value);

  const saveToken = (res) => {
    window.localStorage.setItem('access_token', res.token);
    setUser(res.user);
    setToken(res.token);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      api.logUserIn(username, password)
        .then(res => res.json())
        .then(res => saveToken(res))
        .catch(e => console.log(e));
      setUsername('');
      setPassword('');
    }
  }

  return access_token ? <Redirect to={{
    pathname: "/",
    state: {userData: user}
  }}/> : (
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
