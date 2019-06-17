import React, { useContext } from 'react';
import './User.less';
import FadeIn from 'react-fade-in';
import api from '../../api-client';
import { Contact, ContactList } from '..';
import maleAvatar from '../../assets/img_avatar.png';
import { RenderContext } from '../../containers/Home';

function User() {
  const { userData } = useContext(RenderContext);
  return (
    <FadeIn>
    <div><img src={maleAvatar} style={{ width: 75, height: 75, borderRadius: 50 }} alt="avatar"/>{userData.username}</div>
      <div>
        <div className="contacts">Contacts</div>
        <ContactList/>
      </div>
    </FadeIn>
  );
}



export default User;
