import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import './CallExpired.less'

function CallExpired(props) {
  if (props.history.action === 'POP') props.history.push('/');
  return (
    <div className="expired">
      <div className="options">
        <div className="prompt">
      Call Expired!
        </div>
    <Link to="/"><Button size="large">Home</Button></Link>
      </div>
    </div>
  );
}


export default CallExpired;
