import React, { useEffect, useState } from 'react'; 
import Sidebar from '../Asidebar/Sidebar';
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminCarItem from '../adminCarItem/AdminCarItem';
import './adminCars.css';
import { faPlus, faInfoCircle, faTrash, faImage, faEdit } from '@fortawesome/free-solid-svg-icons';

const AdminCars = () => {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: { 
            id: '', 
            name: '' 
        }
    });
    const [editFormData, setEditFormData] = useState({
        name: '',
        brand: {
            id: '',
            name: ''
        }
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCarId, setDeleteCarId] = useState(null);
    const [filterText, setFilterText] = useState(''); // Stan do filtrowania

    useEffect(() => {
        fetch('http://localhost:8080/api/car')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCars(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => console.error('Error fetching cars:', error));

        fetch('http://localhost:8080/api/brand')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBrands(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => console.error('Error fetching brands:', error));
    }, []);

    const handleInputChange = (e, setFormData) => {
        const { name, value } = e.target;
        if (name === 'brand') {
            const selectedBrand = brands.find(brand => brand.id === parseInt(value));
            setFormData(prevState => ({
                ...prevState,
                brand: selectedBrand
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAddCarClick = () => {
        setShowModal(true);
    };

    const handleEditClick = (car) => {
        setSelectedCar(car);
        setEditFormData({
            name: car.name,
            brand: {
                id: car.brand.id,
                name: car.brand.name
            }
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteCarId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        fetch(`http://localhost:8080/api/car/${deleteCarId}/delete`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setCars(prevCars => prevCars.filter(car => car.id !== deleteCarId));
            } else {
                console.error('Error deleting car:', response.statusText);
            }
            setShowDeleteModal(false);
        })
        .catch(error => console.error('Error deleting car:', error));
    };

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
                setCars(prevCars => [...prevCars, data]);
            } else if (method === 'PUT') {
                setCars(prevCars => prevCars.map(car => 
                    car.id === selectedCar.id ? data : car
                ));
            }
            setModalVisible(false);
        })
        .catch(error => console.error(`Error ${method === 'POST' ? 'creating' : 'updating'} car:`, error));
    };

    // Filtrowanie samochodów na podstawie wprowadzonego tekstu
    const filteredCars = cars.filter(car => 
        car.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className='admin'>
            <Sidebar />
            <div className='admin-wrapper'>
                <AdminNavbar />
                <div className='admin__cars'>
                    <div className='admin__option car__option' onClick={handleAddCarClick}>
                        <p>Add car</p>
                    </div>
                    <div className='filter__input'>
                        <input
                            type="text"
                            placeholder="Filter by name"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} // Ustawianie wartości filtra
                        />
                    </div>
                    <div className='admin__cars-wrapper'>
                        {filteredCars.length > 0 ? (
                            filteredCars.map(car => (
                                <AdminCarItem 
                                    key={car.id}
                                    name={car.name}
                                    model={car.brand.name}
                                    onEditClick={() => handleEditClick(car)}
                                    onDeleteClick={() => handleDeleteClick(car.id)}
                                />
                            ))
                        ) : (
                            <p>No cars found</p>
                        )}
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Car</h2>
                        <form onSubmit={(e) => handleSubmit(e, 'http://localhost:8080/api/car/create', 'POST', formData, setShowModal)}>
                            <div className='modal__inputs'>
                                <div className='newsletter__group'>
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" name="name" value={formData.name} onChange={(e) => handleInputChange(e, setFormData)} />
                                </div>
                                <div className='newsletter__group'>
                                    <label htmlFor="brand">Brand:</label>
                                    <select name="brand" value={formData.brand.id} onChange={(e) => handleInputChange(e, setFormData)}>
                                        <option value="">Select Brand</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        
                            <button type="submit">Add Car</button>
                        </form>
                        <button onClick={() => setShowModal(false)}>Close Modal</button>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Car</h2>
                        <form onSubmit={(e) => handleSubmit(e, `http://localhost:8080/api/car/${selectedCar.id}/update`, 'PUT', editFormData, setShowEditModal)}>
                            <div className='modal__inputs'>
                                <div className='newsletter__group'>
                                    <label htmlFor="name">Name:</label>
                                    <input type="text" name="name" value={editFormData.name} onChange={(e) => handleInputChange(e, setEditFormData)} />
                                </div>
                                <div className='newsletter__group'>
                                    <label htmlFor="brand">Brand:</label>
                                    <select name="brand" value={editFormData.brand.id} onChange={(e) => handleInputChange(e, setEditFormData)}>
                                        <option value="">Select Brand</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        
                            <button type="submit">Update Car</button>
                        </form>
                        <button onClick={() => setShowEditModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Do you really want to delete this car?</h2>
                        <button onClick={confirmDelete}>Yes</button>
                        <button onClick={() => setShowDeleteModal(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCars;
