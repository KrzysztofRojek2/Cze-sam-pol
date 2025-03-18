import React, { useEffect } from 'react';
import './adminNavbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Usuń token z localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('cartId');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // if (!token || !userId) {
    //   navigate('/');
    //   return;
    // }

    fetch(`http://localhost:8080/api/auth/role/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }
        return response.text(); // Pobieramy odpowiedź jako tekst
      })
      .then(data => {
        const role = parseInt(data, 10); // Konwertujemy odpowiedź na liczbę
        if (role !== 1) {
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
        navigate('/');
      });
  }, [navigate]);

  return (
    <nav className='admin-navbar'>
      <h2>Home</h2>
      <FontAwesomeIcon icon={faPowerOff} size='2x' className="power-off-icon" onClick={handleLogout}/>
    </nav>
  );
};

export default AdminNavbar;
