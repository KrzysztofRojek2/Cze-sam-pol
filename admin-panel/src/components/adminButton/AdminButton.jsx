import React from 'react';
import './adminButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminButton = ({ onClick, dataTooltip, text, faIcon }) => {
  return (
    <button
      className={`admin-button ${dataTooltip ? 'has-tooltip' : ''}`}
      onClick={onClick}
      data-tooltip={dataTooltip}
    >
      {faIcon && <FontAwesomeIcon icon={faIcon} size='2x' />}
      {text}
    </button>
  );
};

export default AdminButton;
