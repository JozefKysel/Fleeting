import React, { useState, useEffect } from 'react';
import './Home.less';
import { User, NavBar, Footer, InputTime, CallPaneReceiver, CallExpired} from '../components';
import { listenForIncomingCall } from '../services/CallService';
import { Router, Link} from "@reach/router";
import api from '../api-client';
import { Button } from 'antd';
import FadeIn from 'react-fade-in';
import 'antd/lib/button/style';


export const RenderContext = React.createContext(null);
export const CallerContext = React.createContext(null);

function Home(props) {
  const [createContact, setCreateContact] = useState(false);
  const [selectContact, setSelectContact] = useState('');
  const [goToTimeInput, setGoToTimeInput] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callExpired, setCallExpired] = useState(false);
  const [incomingTimeData, setIncomingTimeData] = useState({});
  const [userData, setUserData] = useState(props.location.state.userData);

  useEffect(() => {
    setUserData(props.location.state.userData);
  }, []);

  const addToContacts = (contact) => {
    api.addContact(userData.username, contact)
      .then(res => res.json())
      .then(res => userData.contacts.push(res))
      .catch(e => console.log(e));
    setUserData(userData);
  }

  const setIncomingCallFlag = (timeData) => {
    setIncomingCall(true)
    setIncomingTimeData(timeData)
  }

  listenForIncomingCall(setIncomingCallFlag)

  const addAContact = (flag) => {
    setCreateContact(flag)
  }

  const selectContactToCall = (contact) => {
    setSelectContact(contact)
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
  } else if (goToTimeInput && selectContact) {
    return (
      <div>
        <CallerContext.Provider value={{ callHasExpired }}>
          <InputTime />
        </CallerContext.Provider>
      </div>
    )
  } else {
    return (
      <RenderContext.Provider value={{ selectContactToCall, addAContact }}>
        <div className="Home">
          <div className="NavBar">
            <NavBar userData={props.location.state.userData}/>
          </div>
          <div className="user-profile">
            <User addToContacts={addToContacts} userData={userData}/>
          </div>
          <div className="Footer">
            <Footer/>
          </div>
        </div>
      </RenderContext.Provider>
    );
  }
}

export default Home;

// <div className="contactsButton">
//   <FadeIn>
//     <Button size="small"> Add</Button>
//   </FadeIn>
// </div>
