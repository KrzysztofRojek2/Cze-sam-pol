import React, { useState, useEffect } from 'react';
import Sidebar from '../Asidebar/Sidebar';
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminBrandItem from '../adminBrandItem/AdminBrandItem';
import './adminBrands.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faInfoCircle, faTrash, faImage, faEdit } from '@fortawesome/free-solid-svg-icons';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });
    const [editFormData, setEditFormData] = useState({
        name: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterText, setFilterText] = useState(''); // Stan do filtrowania

    useEffect(() => {
        fetch('http://localhost:8080/api/brand')
            .then(response => response.json())
            .then(data => {
                setBrands(data);
            })
            .catch(error => console.error('Error fetching brands:', error));
    }, []);

    const handleInputChange = (e, setFormData) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleAddBrandClick = () => {
        setShowModal(true);
    }

    const handleEditClick = (brand) => {
        setSelectedBrand(brand);
        setEditFormData({
            name: brand.name
        });
        setShowEditModal(true);
    }

    const handleDeleteClick = (id) => {
        setSelectedBrand(id);
        setShowDeleteModal(true);
    }

    const confirmDelete = () => {
        fetch(`http://localhost:8080/api/brand/${selectedBrand}/delete`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setBrands(prevBrands => prevBrands.filter(brand => brand.id !== selectedBrand));
            } else {
                console.error('Error deleting brand:', response.statusText);
            }
            setShowDeleteModal(false);
        })
        .catch(error => console.error('Error deleting brand:', error));
    }

    const handleSubmit = (e, url, method, formData, setModalVisible) => {
        e.preventDefault();
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (method === 'POST') {
                setBrands(prevBrands => [...prevBrands, data]);
            } else if (method === 'PUT') {
                setBrands(prevBrands => prevBrands.map(brand => 
                    brand.id === selectedBrand.id ? data : brand
                ));
            }
            setModalVisible(false);
        })
        .catch(error => console.error(`Error ${method === 'POST' ? 'creating' : 'updating'} brand:`, error));
    }

    // Filtrowanie marek na podstawie wprowadzonego tekstu
    const filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className='admin'>
            <Sidebar />
            <div className='admin-wrapper'>
                <AdminNavbar />
                <div className='admin__brands'>
                    <div className='admin__option brand__option' onClick={handleAddBrandClick}>
                        <p>Add brand</p>
                    </div>
                    <div className='filter__input'>
                        <input
                            type="text"
                            placeholder="Filter by name"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} // Ustawianie wartości filtra
                        />
                    </div>
                    <div className='admin__brands-wrapper'>
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map(brand => (
                                <AdminBrandItem 
                                    key={brand.id}
                                    brandName={brand.name}
                                    onEditClick={() => handleEditClick(brand)}
                                    onDeleteClick={() => handleDeleteClick(brand.id)}
                                />
                            ))
                        ) : (
                            <p>No brands found</p>
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Brand</h2>
                        <form onSubmit={(e) => handleSubmit(e, 'http://localhost:8080/api/brand/create', 'POST', formData, setShowModal)}>
                            <div className='modal__inputs'>
                                <div className='newsletter__group'>
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" name="name" value={formData.name} onChange={(e) => handleInputChange(e, setFormData)} />
                                </div>
                            </div>
                        
                            <button type="submit">Add Brand</button>
                        </form>
                        <button onClick={() => setShowModal(false)}>Close Modal</button>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Brand</h2>
                        <form onSubmit={(e) => handleSubmit(e, `http://localhost:8080/api/brand/${selectedBrand.id}/update`, 'PUT', editFormData, setShowEditModal)}>
                            <div className='modal__inputs'>
                                <div className='newsletter__group'>
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" name="name" value={editFormData.name} onChange={(e) => handleInputChange(e, setEditFormData)} />
                                </div>
                            </div>
                        
                            <button type="submit">Update Brand</button>
                        </form>
                        <button onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Do you really want to delete this item?</h2>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={() => setShowDeleteModal(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminBrands;
