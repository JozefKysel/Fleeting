import React, { useEffect } from 'react'
import { useState, useContext } from 'react';
import { CallerContext } from '../../containers/Home';
import './Countdown.less'

function Countdown(props) {

  const { callHasExpired } = useContext(CallerContext)

  const timeSubString = props.timeData.callLength.substring(3)
  const startingTime = Date.parse('1970-01-01T00:' + timeSubString + 'Z')
  const interval = 1000;

  const [time, setTime] = useState(startingTime)

  useEffect(() => {

    setInterval(() => {
      setTime(time => time - interval);
    }, interval);

  }, [])

  if (!props.callee) {
    if (time === 0) {
      callHasExpired(true)
    }
  }

  if (time > 5000) {
  return (
    <div className="time">
      {new Date(time).toISOString().slice(11, -5)}
    </div>
  )
  } else {
    return (
      <div className="timeShort">
      {new Date(time).toISOString().slice(11, -5)}
    </div>
    )
  }
}

export default Countdown;
