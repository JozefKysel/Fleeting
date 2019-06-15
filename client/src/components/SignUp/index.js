import React, { useState } from 'react';
import api from '../../api-client';
import './SignUp.less';

function Signup() {

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');

  const onName = (e) => setUser(e.target.value);
  const onPassword = (e) => setPassword(e.target.value);
  const onMail = (e) => setEmail(e.target.value);
  const onGender = (e) => setGender(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && password && email && gender) {
      api.saveUser(user, password, email, gender);
      setUser('');
      setPassword('');
      setEmail('');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={user} onChange={onName}></input>
      <input type="password" value={password} onChange={onPassword}></input>
      <input type="text" value={email} onChange={onMail}></input>
      <select onChange={onGender}>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <input type="submit" value="sign up"></input>
    </form>
  );
}

export default Signup;
