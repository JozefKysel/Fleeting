import React from 'react';
import { useState } from 'react';
import App from '../containers/App';
import './CreateContact.less'

function CreateContact() {

  const [formInput, setFormInput] = useState('')
  const [goBack, setGoBack] = useState(false)

  const handleOnSubmitContact = event => {
    event.preventDefault();
  }

  const handleOnChangeContact = event => {
    setFormInput(event.target.value)
  }

  const handleOnSubmitGoBack = event => {
    event.preventDefault();
    setGoBack(true);
  }

    if (!goBack) {
      return (
        <div className="CreateContact">

          Create Contact Component

        <form onSubmit={handleOnSubmitContact}>
            <p>Contact</p>
            <input type="text" onChange={handleOnChangeContact} value={formInput}></input>
            <input type="submit" value="Add"></input>
          </form>

          <button onClick={handleOnSubmitGoBack}>Done</button>

        </div>
      );
    } else {
      return (
        <App/>
      )
    }
}
  export default CreateContact;
