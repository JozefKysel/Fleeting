import React from 'react';
import { Contact } from '..';

function ContactList({add, contacts}) {

  return contacts.map(contact =>
    <div key={contact._id}>
      <Contact add={add} contact={contact}/>
    </div>);
}

export default ContactList;
