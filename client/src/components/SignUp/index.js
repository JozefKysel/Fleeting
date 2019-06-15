import React, { useState } from 'react';
import api from '../../api-client';
import './SignUp.less';

function Signup() {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onName = (value) => setUser(value);
  const onPassword = (value) => setPassword(value);
  const onMail = (value) => setEmail(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && password && email) {
      api.saveUser(user, password, email);
      setUser('');
      setPassword('');
    }
  }

  return (
    <form>
      <input type="text" value={user} onChange={onLogin}></input>
      <input type="text" value={email} onChange={onMail}></input>
      <input type="password" value={password}></input>
      <input type="submit" value="Login" onSubmit={handleSubmit}></input>
    </form>
  );
}

export default Signup;
