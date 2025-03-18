import React from 'react';
import './adminTransactionObject.css';
import AdminButton from '../adminButton/AdminButton';

const AdminTransactionObject = ({ transaction, isApproved, onAcceptTransaction, onCancelTransaction }) => {
  const { id, date, status, price, userId, shippingId, transactionParts } = transaction;

  const handleAcceptTransaction = () => {
    onAcceptTransaction(id); // Wywołanie przekazanej funkcji onAcceptTransaction z identyfikatorem transakcji
  };

  const handleCancelTransaction = () => {
    onCancelTransaction(id); // Wywołanie przekazanej funkcji do anulowania transakcji
  };

  return (
    <div className='admin-transaction-object admin-form'>
      <div className='transaction__meta-info meta-info'>
        <p>Transaction ID: {id}</p>
        <p>User ID: {userId}</p>
        <p>Date: {new Date(date).toLocaleDateString()}</p>
        <p>Status: <strong>{status}</strong></p>
        {status === 'AWAITING_RETURN' && <p style={{ color: 'orange' }}>Waiting for return</p>}
      </div>
      <div className='transaction__product-info'>
        <p>Bought Products:</p>
        <p>Number of Items:</p>
        <p>Price:</p>
      </div>
      {transactionParts.map((transactionPart, index) => (
        <div key={index} className='finalized-transaction__item'>
          <div className='finalized-transaction__item__name-img'>
            <img src={transactionPart.partDto.image || "src/assets/part2.jpg"} alt={transactionPart.partDto.name} />
            <p>{transactionPart.partDto.name}</p>
          </div>
          <p className='transaction__item__full-price'>{transactionPart.quantity}x{transactionPart.partDto.price} zł</p>
          <p>{transactionPart.quantity * transactionPart.partDto.price} zł</p>
        </div>
      ))}
      <div className='admin-transaction__bottom'>
        <p className='meta-info'>Full Price: {price} zł</p>
        {!isApproved && <AdminButton text={"Accept Transaction"} onClick={handleAcceptTransaction} />}
        {isApproved && status === 'AWAITING_RETURN' && <AdminButton text={"Cancel Transaction"} onClick={handleCancelTransaction} />}
      </div>
    </div>
  );
};

export default AdminTransactionObject;
