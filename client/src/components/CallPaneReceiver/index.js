import React from 'react';
import { useEffect, useRef } from 'react';
import { CountdownReceiver } from '..';
import { getRemoteStream,  } from '../../services/CallService'
import './CallPaneReceiver.less'

function CallPaneReceiver(props) {

  const remoteVideo = useRef(null);

  useEffect(() => {
    getRemoteStream(remoteStream => {
      remoteVideo.current.srcObject = remoteStream;
    })
  }, []);

  // <CountdownReceiver timeData={{ callLength: props.value.incomingTimeData.callLength }}
  // callExpired={props.value.callHasExpired}
  return (
    <>
      {/* LOCAL VIDEO */}
      {/* <video autoPlay muted style={{ width: '100%', height: '200px' }} ref={localVideo => setSrcObject(localVideo)} /> */}
      <div className="video">
      <video autoPlay style={{ width: '100%' }} ref={remoteVideo} />
      {/* REMOTE VIDEO */}
      <div className="countdown">
      </div>
      </div>
    </>
  );
}

export default CallPaneReceiver;
