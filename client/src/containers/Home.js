import React, { useState, useEffect } from 'react';
import { listenForIncomingCall, listenForCallLength } from '../services/CallService';
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

  const [incomingTimeData, setIncomingTimeData] = useState({});
  const [userData, setUserData] = useState({});
  const [contacts, setUserContacts] = useState({});

  useEffect(() => {
    const { userInfo } = jwtDecode(window.localStorage.getItem('access_token'));
    api.getUserData(userInfo.email)
      .then(res => res.json())
      .then(res => {
        setUserData(res);
        setUserContacts(res.contacts);
      });
    listenForIncomingCall(props)
    listenForCallLength(setIncomingCallFlag);
  }, [])

  const addToContacts = (contact) => {
    if (!contacts.some(element => element._id === contact._id) && userData._id !== contact._id) {
      api.addContact(userData.username, contact)
      .then(res => res.json())
      .then(res => setUserContacts(res.contacts))
      .catch(e => console.log(e));
    }
  }

  const setIncomingCallFlag = (timeData) => {
    setIncomingTimeData(timeData)
  }

  const logout = () => {
    window.localStorage.clear();
    props.history.push('/login');
  }

  return (
    <RenderContext.Provider value={{
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
        <FadeIn>
          <Button size="small" onClick={logout}></Button>
        </FadeIn>
        <div className="Footer">
          <Footer/>
        </div>
      </div>
    </RenderContext.Provider>
  );
}

export default Home;

// <div className="contactsButton">
//   <FadeIn>
//     <Button size="small"> Add</Button>
//   </FadeIn>
// </div>
