import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './adminTransactions.css';
import Sidebar from '../Asidebar/Sidebar'
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminTransactionObject from '../../components/adminTransactionObject/AdminTransactionObject';
import { Link } from 'react-router-dom';

const AdminTransactions = () => {
    const location = useLocation();
    const [transactions, setTransactions] = useState([]);
    const endpoint = location.pathname.endsWith('/approved') ? 'http://localhost:8080/api/transaction/passed' : 'http://localhost:8080/api/transaction/ongoing';

    useEffect(() => {
        fetch(endpoint)
            .then(response => response.json())
            .then(data => setTransactions(data))
            .catch(error => console.error('Error fetching transactions:', error));
    }, [endpoint]);

    const acceptTransaction = (transactionId) => {
        fetch(`http://localhost:8080/api/transactionAccept/${transactionId}/status/SHIPPED`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Aktualizacja stanu transakcji po zaakceptowaniu
            setTransactions(prevTransactions =>
                prevTransactions.map(transaction =>
                    transaction.id === transactionId ? data : transaction
                )
            );
            window.location.reload();
        })
        .catch(error => console.error('Error accepting transaction:', error));
    };

    return (
        <div className='admin'>
          <Sidebar />
          <div className='admin-wrapper'>
            <AdminNavbar />
            <div className='admin__products'>
              <div className='admin__option'>
                {location.pathname.endsWith('/approved') ? (
                  <Link to="/admin-transactions/awaiting">
                    Go to Awaiting
                  </Link>
                ) : (
                  <Link to="/admin-transactions/approved">
                    Go to Approved
                  </Link>
                )}
              </div>
              <div className='admin__products-wrapper'>
                {transactions.map(transaction => (
                  <AdminTransactionObject 
                    key={transaction.id} 
                    transaction={transaction} 
                    isApproved={location.pathname.endsWith('/approved')} 
                    onAcceptTransaction={acceptTransaction} // Przekazanie funkcji acceptTransaction do komponentu AdminTransactionObject
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
    );
};

export default AdminTransactions;
