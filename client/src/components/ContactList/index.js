import React from 'react';
import { Contact } from '..';

function ContactList({contacts}) {
  console.log(contacts);
  return contacts.map(contact =>
    <div key={contact._id}>
      <Contact contact={contact}/>
    </div>);
}

export default ContactList;
