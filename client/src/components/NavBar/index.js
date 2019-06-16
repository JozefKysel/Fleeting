import React, { useState } from 'react';
import './NavBar.less';
import { Input } from 'antd';
import api from '../../api-client';

function NavBar({userData}) {

  const Search = Input.Search;
  const [contacts, setContact] = useState({});

  const handleSearch = (e) => {
    api.searchForUsers(e.target.value)
      .then(res => res.json())
      .then(res => setContact(res))
      .catch(e => console.log(e));
  }

  const addContact = () => {
    setContact(contacts);
  }

  return (
    <div className="Nav">
      <div className="title">
      Fleeting
      </div>
      <div className="search">
      <Search placeholder="search contacts" onChange={handleSearch} enterButton />
      </div>
      <button onClick={addContact}></button>
    </div>
  );
}

export default NavBar;
