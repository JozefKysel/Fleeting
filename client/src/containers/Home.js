import React from 'react';
import './Home.less';
import { useState } from 'react';
import { NavBar, Footer, InputTime, CallPaneReceiver, CallExpired} from '../components';
import { User } from '../components';
import { listenForIncomingCall } from '../services/CallService';
import { Router, Link, navigate } from "@reach/router";
import { Button } from 'antd';
import FadeIn from 'react-fade-in';
import 'antd/lib/button/style';


export const RenderContext = React.createContext(null);
export const CallerContext = React.createContext(null);

function Home(props) {
  const [createContact, setCreateContact] = useState(false)
  const [goToTimeInput, setGoToTimeInput] = useState(false)
  const [incomingCall, setIncomingCall] = useState(false)
  const [callExpired, setCallExpired] = useState(false)
  const [incomingTimeData, setIncomingTimeData] = useState({});

  const setIncomingCallFlag = (timeData) => {
    setIncomingCall(true)
    setIncomingTimeData(timeData)
  }

  listenForIncomingCall(setIncomingCallFlag)

  const addAContact = (flag) => {
    setCreateContact(flag)
  }

  const selectContactToCall = (contact) => {
    setGoToTimeInput(true)
  }

  const callHasExpired = (flag) => {
    setCallExpired(flag)
  }

  if (callExpired) {
    return (
      <div>
        <CallExpired />
      </div>
    )
  } else if (incomingCall && incomingTimeData) {
    return (
      <div>
        <CallerContext.Provider >
          <CallPaneReceiver value={{ incomingTimeData, callHasExpired }} />
        </CallerContext.Provider>
      </div>
    )
  } else if (goToTimeInput) {
    return (
      <div>
        <CallerContext.Provider value={{ callHasExpired }}>
          <InputTime />
        </CallerContext.Provider>
      </div>
    )
  } if (!createContact) {
    return (
      <div>
        <RenderContext.Provider value={{ selectContactToCall, addAContact }}>
          <div className="addContactButton">
          <div className="contacts">
            Contacts
          </div>
          </div>
            <User userData={props.location.state.userData}/>
          <div className="contactsButton">
            <FadeIn>
            <Button size="large"> Add To Contacts</Button>
            </FadeIn>
          </div>
        </RenderContext.Provider>
      </div>
    );
  }

}

export default Home;
