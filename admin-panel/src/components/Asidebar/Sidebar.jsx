import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faShoppingCart, faCar, faStar, faTags, faStore, faHome, faUser, faComment, faRepeat, faRainbow, faExclamation, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  return (
    <nav className='sidebar'>
        <h2 className='sidebar__header'> <FontAwesomeIcon icon={faStore} /> Store</h2>
        <div className='sidebar__options'>
            <Link to="/home"><FontAwesomeIcon icon={faHome} /> Home</Link>
            <Link to="/admin-transactions-menu"><FontAwesomeIcon icon={faShoppingCart} /> Transactions</Link>
            <Link to="/admin-products"><FontAwesomeIcon icon={faBoxOpen} /> Products</Link>
            <Link to="/admin-cars"><FontAwesomeIcon icon={faCar} /> Cars</Link>
            <Link to="/admin-brands"><FontAwesomeIcon icon={faTags} /> Brands</Link>
            <Link to="/users"><FontAwesomeIcon icon={faUser} /> Users</Link>
            <Link to="/returns"><FontAwesomeIcon icon={faRepeat} /> Returns</Link>
            <Link to="/reports"><FontAwesomeIcon icon={faExclamationCircle} /> Reports</Link>
            {/* <Link to="/admin-brands"><FontAwesomeIcon icon={faComment} /> Reviews</Link> */}
            {/* <Link to="/admin-brands"><FontAwesomeIcon icon={faUser} /> Users</Link> */}
            {/* <p><FontAwesomeIcon icon={faStar} /> Reviews</p> */}
        </div>
    </nav>
  );
}

export default Sidebar;