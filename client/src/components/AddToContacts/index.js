import React from 'react';
import { useContext } from 'react'
import { RenderContext } from '../../containers/Home';
import { Button } from 'antd';
import 'antd/lib/button/style';
import FadeIn from 'react-fade-in';

function AddToContacts() {

  const { addAContact } = useContext(RenderContext)

  const handleOnClick = event => {
    event.preventDefault();
    addAContact(true)
  }

  return (
    <div className="AddToContacts">
      <FadeIn>
        <Button onClick={handleOnClick} size="large"> Add To Contacts</Button>
      </FadeIn>
    </div>
  );
}

export default AddToContacts;
