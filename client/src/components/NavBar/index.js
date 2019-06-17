import React, { useState } from 'react';
import './NavBar.less';
import { Input } from 'antd';
import { Contact } from '..';
import api from '../../api-client';

function NavBar({userData}) {

  const Search = Input.Search;
  const [contacts, setContact] = useState({});

  const handleSearch = (e) => {
    if (e.target.value) {
      api.searchForUsers(e.target.value)
        .then(res => res.json())
        .then(res => setContact(res))
        .catch(e => console.log(e));
    }
  }

  return (
    <div className="Nav">
      <div className="title">
      Fleeting
      </div>
      <div className="search">
      <Search placeholder="search contacts" onChange={handleSearch} enterButton />
      <br>
      </br>
      {contacts && Object.keys(contacts).length > 0 && <Contact className="searchContact" contact={contacts}/>}
      </div>
    </div>
  );
}

export default NavBar;
