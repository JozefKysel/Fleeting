import React from 'react';
import './InputTime.less';
import { TimePicker } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { CallPaneCaller } from '..';
import 'antd/dist/antd.css';
import FadeIn from 'react-fade-in';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function InputTime(props) {
  if (props.history.action === 'POP') props.history.push('/');

  const [callLength, setCallLength] = useState('');

  const handleOnChange = (time, timeString) => {
    setCallLength(timeString)
  }

  return (
    <FadeIn>
      <div className="TimePicker">
      <span className="picker">Select Call Length</span>
        <TimePicker onChange={handleOnChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} inputReadOnly={true} />
        <div className="done">
          {callLength && <Link to={{
            pathname: '/caller',
            state: {
              timeData: callLength
            }
          }}><Button size="large">Done</Button></Link>}
        </div>
      </div>
    </FadeIn>
  );
}


export default InputTime;
