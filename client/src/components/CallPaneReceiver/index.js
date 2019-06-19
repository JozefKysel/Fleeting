import React, { useEffect, useRef, useState }  from 'react';
import { Countdown } from '..';
import { getRemoteStream, listenForCallLength  } from '../../services/CallService';
import './CallPaneReceiver.less';

function CallPaneReceiver(props) {
  if (props.history.action === 'POP') props.history.push('/');
  const [time, setTime] = useState('');
  const remoteVideo = useRef(null);

  const setIncomingCallFlag = (timeData) => {
    const timeSubString = timeData.substring(3);
    const startingTime = Date.parse('1970-01-01T00:' + timeSubString + 'Z');
    setTime(startingTime);
  }

  listenForCallLength(setIncomingCallFlag);

  useEffect(() => {
    getRemoteStream(remoteStream => {
      remoteVideo.current.srcObject = remoteStream;
    });
  }, []);

  return (
    <>
      {/* LOCAL VIDEO */}
      {/* <video autoPlay muted style={{ width: '100%', height: '200px' }} ref={localVideo => setSrcObject(localVideo)} /> */}
      <div className="video">
      <video autoPlay style={{ width: '100%' }} ref={remoteVideo} />
      {/* REMOTE VIDEO */}
      <div className="countdown">
        {time && <Countdown startingTime={time}/>}
      </div>
      </div>
    </>
  );
}

export default CallPaneReceiver;
