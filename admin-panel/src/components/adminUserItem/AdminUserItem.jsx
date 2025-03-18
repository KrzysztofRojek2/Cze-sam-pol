import React from 'react';
import AdminButton from '../adminButton/AdminButton';
import { faInfoCircle, faBan, faUnlock } from '@fortawesome/free-solid-svg-icons';
import './adminUserItem.css';

const AdminUserItem = ({ name, isBanned, onInfoClick, onBanToggle }) => {
   console.log(`Rendering ${name} - isBanned: ${isBanned}`); // Verify the value of isBanned

  return (
   <div className='admin__item'>
      <p>{name}</p>
      <div className='admin__product__btns'>
         <AdminButton 
            dataTooltip="Info" 
            faIcon={faInfoCircle} 
            onClick={onInfoClick}
         />
         <AdminButton 
            dataTooltip={isBanned ? "Unban" : "Ban"} 
            faIcon={isBanned ? faUnlock : faBan} 
            onClick={onBanToggle}
         />
      </div>
   </div>
  )
}

export default AdminUserItem;
