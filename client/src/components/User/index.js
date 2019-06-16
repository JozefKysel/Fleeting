import React, { useEffect } from 'react';
import './User.less';
import FadeIn from 'react-fade-in';
import api from '../../api-client';
import { Contact, ContactList } from '..';
import maleAvatar from '../../assets/img_avatar.png';

function User({userData}) {
  return (
    <FadeIn>
      <div>
        <div><img src={maleAvatar} style={{ width: 75, height: 75, borderRadius: 50 }}/>{userData.username}</div>
        <div className="contacts">Contacts</div>
        <ContactList contacts={userData.contacts}/>
      </div>
    </FadeIn>
  );
}



export default User;
