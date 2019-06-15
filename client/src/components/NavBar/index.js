import React from 'react';
import './NavBar.less';
import { Input } from 'antd';

function NavBar() {

  const Search = Input.Search;

  return (
    <div className="Nav">
      <div className="title">
      Fleeting
      </div>
      <div className="search">
      <Search placeholder="search contacts" onSearch={value => console.log(value)} enterButton />
      </div>
    </div>
  );
}

export default NavBar;
