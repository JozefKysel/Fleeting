import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import './Countdown.less';

function Countdown({startingTime}) {
  const [time, setTime] = useState('');
  const interval = 1000;

  useEffect(() => {
    setTime(startingTime);
    setInterval(() => {
      setTime(time => time - interval);
    }, interval);
  }, []);

  return (
    <div className="time">
    {time && new Date(time).toISOString().slice(11, -5)}
    {time === 0 && <Redirect to="/expired"/>}
    </div>
  );
}

export default Countdown;
