import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faCarSide, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import './adminHome.css';
import Sidebar from '../Asidebar/Sidebar'
import AdminNavbar from '../Anavbar/AdminNavbar';

const AdminHome = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [carsCount, setCarsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/partsCount')
      .then(response => response.json())
      .then(data => setProductsCount(data))
      .catch(error => console.error('Error fetching products count:', error));

    fetch('http://localhost:8080/api/brandsCount')
      .then(response => response.json())
      .then(data => setCategoriesCount(data))
      .catch(error => console.error('Error fetching categories count:', error));

    fetch('http://localhost:8080/api/carsCount')
      .then(response => response.json())
      .then(data => setCarsCount(data))
      .catch(error => console.error('Error fetching cars count:', error));

    fetch('http://localhost:8080/api/usersCount')
      .then(response => response.json())
      .then(data => setCustomersCount(data))
      .catch(error => console.error('Error fetching customers count:', error));
  }, []);

  return (
    <div className='admin'>
      <Sidebar />
      <div className='admin-wrapper'>
        <AdminNavbar />
        <div className='admin__dashboards'>

          <div className='dashboard blue'>
            <div className='dashboard__text'>
              <p>PRODUCTS</p>
              <h3>{productsCount}</h3>
            </div>
            <FontAwesomeIcon icon={faBox} size="2x" className='dashboard__icon' />
          </div>
          <div className='dashboard orange'>
            <div className='dashboard__text'>
              <p>BRANDS</p>
              <h3>{categoriesCount}</h3>
            </div>
            <FontAwesomeIcon icon={faTags} size="2x" className='dashboard__icon' />
          </div>
          <div className='dashboard red'>
            <div className='dashboard__text'>
              <p>CARS</p>
              <h3>{carsCount}</h3>
            </div>
            <FontAwesomeIcon icon={faCarSide} size="2x" className='dashboard__icon' />
          </div>
          <div className='dashboard green'>
            <div className='dashboard__text'>
              <p>CUSTOMERS</p>
              <h3>{customersCount}</h3>
            </div>
            <FontAwesomeIcon icon={faUserFriends} size="2x" className='dashboard__icon' />
          </div>
        </div>
        <div className='admin__charts'>
          {/* <div className='chart'>

          </div>
          <div className='chart'>

          </div> */}
        </div>
      </div>
    </div>
  )
}

export default AdminHome;
