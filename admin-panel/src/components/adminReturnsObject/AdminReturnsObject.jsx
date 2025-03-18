import React, { useState, useEffect } from 'react';
import './adminReturnsObject.css';
import AdminButton from '../adminButton/AdminButton';

const AdminReturnsObject = ({ transaction, isApproved, onAcceptTransaction, onCancelTransaction }) => {
  const { id, date, status, price, userId, transactionId, reason, image } = transaction;

  const [orderDetails, setOrderDetails] = useState([]); // Stan dla szczegółów zamówienia

  // Pobieranie szczegółów zamówienia
  useEffect(() => {
    if (transactionId) {
      fetch(`http://localhost:8080/api/transaction/${transactionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch transaction details');
          }
          return response.json();
        })
        .then((data) => {
          setOrderDetails(data); // Ustaw dane szczegółów zamówienia
        })
        .catch((error) => {
          console.error('Error fetching transaction details:', error);
        });
    }
  }, [transactionId]);

  const handleAcceptTransaction = () => {
    onAcceptTransaction(transactionId);
  };

  const handleCancelTransaction = () => {
    onCancelTransaction(id);
  };

  return (
    <div className='admin-transaction-object admin-form'>
      <div className='transaction__meta-info meta-info'>
        <p>Return ID: {id}</p>
        <p>Order ID: {transactionId}</p>
      </div>
      <div className='transaction__meta-info meta-info'>
        <p>User ID: {userId}</p>
        <p>Return status: <strong>{status}</strong></p>
      </div>
      <div className='transaction__meta-info meta-info'>
        <p>Reason: {reason}</p>
        <p>Date: {new Date(date).toLocaleDateString()}</p>
      </div>
      <div className='transaction__product-info'>
        <p>Photo of returns:</p>
      </div>
      {image ? (
        <img 
          src={`data:image/jpeg;base64,${image}`} 
          alt="Return Item" 
          style={{ maxWidth: '250px' }} 
        />
      ) : (
        <img 
          src="src/assets/part2.jpg" 
          alt="Default Placeholder" 
          style={{ maxWidth: '200px', maxHeight: '200px' }} 
        />
      )}

      <div className='transaction__product-info'>
        <p>Order Details:</p>
          <div className='transaction_info'>
            <p>Order status: {orderDetails.status}</p>
            <p>Total Price: {orderDetails.price} zł </p>
          </div>
      </div>

      <div className='admin-transaction__bottom'>
        {<AdminButton text="Accept Return" onClick={handleAcceptTransaction} />}
        {<AdminButton text="Cancel Return" onClick={handleCancelTransaction} />}
      </div>
    </div>
  );
};

export default AdminReturnsObject;
