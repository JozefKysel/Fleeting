import React from 'react';
import maleAvatar from '../../assets/img_avatar.png';
import femaleAvatar from '../../assets/img_avatar2.png';
import { Icon } from 'antd';
import { useContext } from 'react';
import { RenderContext } from '../../containers/Home';

function Contact({contact}) {
  const { selectContactToCall } = useContext(RenderContext);
  const handleOnClick = () => {
    selectContactToCall('contact');
  }

  return (
    <div>
      <div className="DB">
        <div className="line">
          <img src={contact.gender === 'male' ? maleAvatar : femaleAvatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: 50 }} />
        </div>
        <span className="name">{contact.username}</span >
        <span className="calldata">{contact.callLengths}</span>
        <Icon onClick={handleOnClick} type="phone"  className="phone" style={{ fontSize: '22px', color: 'rgba(87, 141, 241)' }} />
        <Icon type="star"  className="star" style={{ fontSize: '22px', color: 'rgba(87, 141, 241)' }} />
      </div>
      <div>
      </div>
      <svg height="5" width="420" className="line2">
        <g fill="none">
          <path stroke="#c3ccdb" d="M1 2 l350 0"/>
        </g>
      </svg>
    </div>);
}

export default Contact;
