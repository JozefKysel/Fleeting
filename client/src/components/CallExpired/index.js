import React from 'react';
import { Button } from 'antd';
import { useState } from 'react';
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
      <Button onClick={() => setHome(true)} size="large">Home</Button>
      <Button size="large">Share</Button>
        </div>
      </div>
    )
  }
}


export default CallExpired;
