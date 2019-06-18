import React from 'react';
import { Button } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Home from '../../containers/Home'
import './CallExpired.less'

function CallExpired() {

  const [home, setHome] = useState(false)

  if (home) {
    return (
      <div>
        <Home />
      </div>
    )
  } else {
    return (
      <div className="expired">
        <div className="options">
          <div className="prompt">
        Call Expired!
          </div>
      <Link to="/"><Button size="large">Home</Button></Link>
        </div>
      </div>
    )
  }
}


export default CallExpired;
