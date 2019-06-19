import React, { useContext } from 'react';
import { Contact } from '..';
import { RenderContext } from '../../containers/Home';

function ContactList() {
  const { contacts } = useContext(RenderContext);

  return contacts.length > 0 ? contacts.map(contact =>
    <div key={contact._id}>
      <Contact contact={contact}/>
    </div>) : <div>You have no contacts yet</div>;
}

export default ContactList;
