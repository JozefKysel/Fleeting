import React, { useRef, useState, useEffect } from 'react';
import { Countdown } from '..';
import { Button } from 'antd';
import { start, makeOutGoing, getRemoteStream, listenForCallLength } from '../../services/CallService';
import './CallPaneCaller.less'

function CallPaneCaller(props) {
  if (props.history.action === 'POP') props.history.push('/');
  const [time, setTime] = useState('');
  const [view, setView] = useState(false);
  const remoteVideo = useRef(null);

  const setIncomingCallFlag = (timeData) => {
    const timeSubString = timeData.substring(3);
    const startingTime = Date.parse('1970-01-01T00:' + timeSubString + 'Z');
    setTime(startingTime);
  }

  listenForCallLength(setIncomingCallFlag);

  useEffect(() => {
    getRemoteStream(remoteStream => remoteVideo.current.srcObject = remoteStream)
  }, []);

  const handleOnClick = () => {
    start(true);
    makeOutGoing(props.location.state.timeData);
    setView(true);
  }

  return (
    <>
      <div className="ready" style={{opacity: view ? 0 : 1}}>
        <div className="text">
        <div className="prompt">
          Ready?
          {/* <video autoPlay muted style={{ width: '40%' }} ref={localVideo => setSrcObject(localVideo)} /> */}
        </div>
        </div>
          <Button onClick={handleOnClick} size="large">Start Call</Button>
      </div>
      <div className="video" >
        <video autoPlay style={{ width: '100%' }} ref={remoteVideo} style={{opacity: view ? 1 : 0}}/>
      </div>
      {time && <Countdown startingTime={time}/>}
    </>
  );
}



export default CallPaneCaller;
