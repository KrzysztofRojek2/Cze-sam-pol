import React from 'react';
import AdminButton from '../adminButton/AdminButton';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './adminBrandItem.css'; // Upewnij się, że ścieżka jest poprawna

const AdminBrandItem = ({ brandName, onEditClick, onDeleteClick }) => {
    return (
        <div className='admin__item'>
            <p>{brandName}</p>
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

export default AdminBrandItem;
