import React, { useState, useEffect } from 'react';
import Sidebar from '../Asidebar/Sidebar';
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminTransactionObject from '../adminReturnsObject/AdminReturnsObject';
import './adminReturnsMenu.css';

const AdminReturnsMenu = () => {
    const [returns, setReturns] = useState([]);

    const endpoint = 'http://localhost:8080/api/returns/returns'; // Endpoint dla wszystkich zwrotów

    useEffect(() => {
        fetch(endpoint,{method: 'GET',})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching returns');
                }
                return response.json();
            })
            .then(data => {
                // console.log('Fetched returns data:', data); // Logowanie danych
                setReturns(data);
            })
            .catch(error => console.error('Error fetching returns:', error));
    }, []);
    const handleAcceptReturn = (returnId, transactionId) => {
        updateReturnStatus(returnId, 'APPROVED');
        finalizeTransaction(transactionId, 'RETURNED');
    };

    const handleRejectReturn = (returnId, transactionId) => {
        updateReturnStatus(returnId, 'REJECTED');
        finalizeTransaction(transactionId, 'REJECTED_RETURN');
    };

    const updateReturnStatus = (returnId, status) => {
        fetch(`http://localhost:8080/api/returns/${returnId}?status=${status}`, { // Status jako parametr w URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update return status');
                }
                return response.text();
            })
            .then(() => {
                setReturns(prevReturns =>
                    prevReturns.map(returnItem =>
                        returnItem.id === returnId
                            ? { ...returnItem, status }
                            : returnItem
                    )
                );
            })
            .catch(error => console.error('Error updating return status:', error));
    };

    const finalizeTransaction = (transactionId, status) => {
        fetch(`http://localhost:8080/api/transaction/${transactionId}/status/${status}`, { // Status jako parametr w URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to finalize transaction status');
                }
                return response.json();
            })
            .then(data => {
                console.log('Transaction finalized:', data);
            })
            .catch(error => console.error('Error finalizing transaction status:', error));
    };
    

    return (
        <div className="admin">
            <Sidebar />
            <div className="admin-wrapper">
                <AdminNavbar />
                {/* PENDING column */}
                <div className="returns-column">
                    <h2>PENDING</h2>
                    {returns
                        .filter(returnItem => returnItem.status === 'PENDING')
                        .sort((a, b) => a.id - b.id) // Sortowanie po ID
                        .map((returnItem) => (
                            <AdminTransactionObject
                                key={returnItem.id}
                                transaction={{
                                    id: returnItem.id,
                                    date: returnItem.createdAt,
                                    status: returnItem.status,
                                    transactionId: returnItem.transactionId,
                                    reason: returnItem.reason,
                                    image: returnItem.image,
                                    price: 0, // Możesz dostosować na podstawie danych
                                    userId: returnItem.userId,
                                    shippingId: null, // Jeśli istnieje w danych
                                    transactionParts: [], // Jeśli chcesz wyświetlać produkty zwrotu
                                }}
                                onAcceptTransaction={() => handleAcceptReturn(returnItem.id, returnItem.transactionId)}
                                onCancelTransaction={() => handleRejectReturn(returnItem.id, returnItem.transactionId)}
                            />
                    ))}
                </div>
                <div className="admin__returns-columns">


                    {/* APPROVED column */}
                    <div className="returns-column">
                        <h2>APPROVED</h2>
                        {returns
                            .filter(returnItem => returnItem.status === 'APPROVED')
                            .sort((a, b) => a.id - b.id)
                            .map((returnItem) => (
                                <AdminTransactionObject
                                    key={returnItem.id}
                                    transaction={{
                                        id: returnItem.id,
                                        date: returnItem.createdAt,
                                        status: returnItem.status,
                                        transactionId: returnItem.transactionId,
                                        reason: returnItem.reason,
                                        image: returnItem.image,
                                        price: 0,
                                        userId: returnItem.userId,
                                        shippingId: null,
                                        transactionParts: [],
                                    }}
                                    onAcceptTransaction={() => handleAcceptReturn(returnItem.id, returnItem.transactionId)}
                                    onCancelTransaction={() => handleRejectReturn(returnItem.id, returnItem.transactionId)}
                                />
                            ))}
                    </div>

                    {/* REJECTED column */}
                    <div className="returns-column">
                        <h2>REJECTED</h2>
                        {returns
                            .filter(returnItem => returnItem.status === 'REJECTED')
                            .sort((a, b) => a.id - b.id)
                            .map((returnItem) => (
                                <AdminTransactionObject
                                    key={returnItem.id}
                                    transaction={{
                                        id: returnItem.id,
                                        date: returnItem.createdAt,
                                        status: returnItem.status,
                                        transactionId: returnItem.transactionId,
                                        reason: returnItem.reason,
                                        image: returnItem.image,
                                        price: 0,
                                        userId: returnItem.userId,
                                        shippingId: null,
                                        transactionParts: [],
                                    }}
                                    onAcceptTransaction={() => handleAcceptReturn(returnItem.id, returnItem.transactionId)}
                                    onCancelTransaction={() => handleRejectReturn(returnItem.id, returnItem.transactionId)}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReturnsMenu;
