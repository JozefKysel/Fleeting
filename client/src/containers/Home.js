import React, { useState, useEffect } from 'react';
import { listenForIncomingCall } from '../services/CallService';
import { User, NavBar, Footer, InputTime, CallPaneReceiver, CallExpired} from '../components';
import { Router, Link} from "@reach/router";
import FadeIn from 'react-fade-in';
import 'antd/lib/button/style';
import api from '../api-client';
import { Button } from 'antd';
import './Home.less';
import jwtDecode from 'jwt-decode';


export const RenderContext = React.createContext(null);
export const CallerContext = React.createContext(null);

function Home(props) {
  const [createContact, setCreateContact] = useState(false);
  const [selectContact, setSelectContact] = useState('');
  const [goToTimeInput, setGoToTimeInput] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callExpired, setCallExpired] = useState(false);
  const [incomingTimeData, setIncomingTimeData] = useState({});
  const [userData, setUserData] = useState({});
  const [contacts, setUserContacts] = useState({});

  useEffect(() => {
    const { user } = jwtDecode(window.localStorage.getItem('access_token'));
    setUserContacts(user.contacts);
    setUserData(user);
  }, [])

  const addToContacts = (contact) => {
    api.addContact(userData.username, contact)
      .then(res => res.json())
      .then(res => setUserContacts(res.contacts))
      .catch(e => console.log(e));
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
          <CallPaneReceiver value={{
            incomingTimeData,
            callHasExpired,
          }} />
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
      <RenderContext.Provider value={{
        selectContactToCall,
        addToContacts,
        userData,
        contacts
       }}>
        <div className="Home">
          <div className="NavBar">
            <NavBar userData={userData}/>
          </div>
          <div className="user-profile">
            <User/>
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
