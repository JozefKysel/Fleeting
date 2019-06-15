import React from 'react';
import './Home.less';
import { useState } from 'react';
import { CreateContact, InputTime, CallPaneReceiver, CallExpired, AddToContacts } from '../components';
import DB from '../services/dbService';
import { listenForIncomingCall } from '../services/CallService';
import { Router, Link, navigate } from "@reach/router"

export const RenderContext = React.createContext(null);
export const CallerContext = React.createContext(null);

function Home() {

  const [createContact, setCreateContact] = useState(false)
  const [selectContact, setSelectContact] = useState('')
  const [goToTimeInput, setGoToTimeInput] = useState(false)
  const [incomingCall, setIncomingCall] = useState(false)
  const [callExpired, setCallExpired] = useState(false)
  const [incomingTimeData, setIncomingTimeData] = useState({})

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

  if (!window.localStorage.getItem('access_token')) {
    return (<div>dog</div>)
  } else {
    if (callExpired) {
      console.log('yo')
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
    } if (!createContact) {
      return (
        <div>
          <RenderContext.Provider value={{ selectContactToCall, addAContact }}>
            <div className="addContactButton">
            <div className="contacts">
              Contacts
            </div>
            </div>
            <br />
            <DB />
            <br />
            <div className="contactsButton">
            <AddToContacts />
            </div>
          </RenderContext.Provider>
        </div>
      );
    } else if (createContact) {
      return (
        <div>
          <CreateContact />
        </div>
      )
    }
  }
}

export default Home;
