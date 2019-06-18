import React, { useRef, useState, useEffect } from 'react';
import { Countdown } from '..';
import { Button } from 'antd';
import { start, setSrcObjectRemote, makeOutGoing, getRemoteStream } from '../../services/CallService'
import './CallPaneCaller.less'

function CallPaneCaller(props) {
  const [view, setView] = useState(false);
  const remoteVideo = useRef(null);

  useEffect(() => {
    getRemoteStream(remoteStream => remoteVideo.current.srcObject = remoteStream)
  }, []);

  const handleOnClick = () => {
    start(true);
    makeOutGoing(props.location.state.timeData);
    setView(true)
  }

  return (
    <>
      <div className="ready" style={{opacity: view ? 0: 1}}>
        <div className="text">
        <div className="prompt">
          Ready?
          {/* <video autoPlay muted style={{ width: '40%' }} ref={localVideo => setSrcObject(localVideo)} /> */}
        </div>
        </div>
          <Button onClick={handleOnClick} size="large">Start Call</Button>
      </div>
      <div className="video" style={{opacity: view ? 1: 0}}>
        <video autoPlay style={{ width: '100%' }} ref={remoteVideo} />
        <Countdown/>
      </div>
    </>
  );
}



export default CallPaneCaller;
