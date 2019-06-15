import React from 'react';
import './InputTime.less';
import { TimePicker } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { CallPaneCaller } from '..';
import 'antd/dist/antd.css';
import FadeIn from 'react-fade-in';
import { Button } from 'antd';

function InputTime() {

  const [makeCall, setMakeCall] = useState(false)
  const [callLength, setCallLength] = useState('')

  const handleOnSubmit = () => {
    setMakeCall(true)
  }

  const handleOnChange = (time, timeString) => {
    setCallLength(timeString)
  }

  if (!makeCall) {
    return (
      <FadeIn>
        <div className="TimePicker">
        <span className="picker">Select Call Length</span>
          <TimePicker onChange={handleOnChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} inputReadOnly={true} />
          <div className="done">
            <Button onClick={handleOnSubmit} size="large">Done</Button>
          </div>
        </div>
      </FadeIn>
    );
  } else {
    if (callLength) {
      return (
        <FadeIn>
          <div>
            <CallPaneCaller callLength={callLength} />
          </div>
        </FadeIn>
      )
    }
  }
}

export default InputTime;
