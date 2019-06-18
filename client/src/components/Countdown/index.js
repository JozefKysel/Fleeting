import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { CallerContext } from '../../containers/Home';
import './Countdown.less';
import { listenForCallLength } from '../../services/CallService';

function Countdown() {
  const [time, setTime] = useState('');
  const interval = 1000;

  const setIncomingCallFlag = (timeData) => {
    const timeSubString = timeData.substring(3);
    const startingTime = Date.parse('1970-01-01T00:' + timeSubString + 'Z')
    setTime(startingTime);
    setInterval(() => {
      setTime(time => time - interval);
    }, interval);
  }

  listenForCallLength(setIncomingCallFlag);

if (time) {
  return (
    <div className="time">
      {new Date(time).toISOString().slice(11, -5)}
    </div>
  );
} else {
  return (<div>Calling... </div>)
}
  // } else {
  //   return (
  //     <div className="timeShort">
  //     {new Date(time).toISOString().slice(11, -5)}
  //   </div>
  //   )
  // }
}

export default Countdown;
