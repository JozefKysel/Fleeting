import React, { useState } from 'react';
import api from '../../api-client';
import './SignUp.less';

function Signup() {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');

  const onName = (value) => setUser(value);
  const onPassword = (value) => setPassword(value);
  const onMail = (value) => setEmail(value);
  const onGender = (e) => setGender(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && password && email && gender) {
      api.saveUser(user, password, email, gender);
      setUser('');
      setPassword('');
    }
  }

  return (
    <form>
      <input type="text" value={user} onChange={onLogin}></input>
      <input type="password" value={password} onChange={onPassword}></input>
      <input type="text" value={email} onChange={onMail}></input>
      <select onChange{onGender}>
        <option value="male"></option>
        <option value="female"></option>
      </select>
      <input type="submit" value="sign up" onSubmit={handleSubmit}></input>
    </form>
  );
}

export default Signup;
