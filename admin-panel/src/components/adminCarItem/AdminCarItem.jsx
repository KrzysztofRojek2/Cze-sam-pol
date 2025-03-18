import React from 'react';
import AdminButton from '../adminButton/AdminButton';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './adminCarItem.css';

const AdminCarItem = ({ name, model, onEditClick, onDeleteClick }) => {
    return (
        <div className='admin__item'>
            <p>{name}</p>
            <p>{model}</p>
            <div className='admin__product__btns'>
                <AdminButton 
                    dataTooltip="Modify Data" 
                    faIcon={faEdit} 
                    onClick={onEditClick}
                />
                <AdminButton 
                    dataTooltip="Delete" 
                    faIcon={faTrash} 
                    onClick={onDeleteClick}

                />
            </div>
        </div>
    );
};

export default AdminCarItem;
