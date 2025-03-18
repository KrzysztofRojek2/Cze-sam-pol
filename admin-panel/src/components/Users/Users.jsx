import React, { useEffect, useState } from 'react';
import './users.css';
import Sidebar from '../Asidebar/Sidebar';
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminUserItem from '../adminUserItem/AdminUserItem';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('http://localhost:8080/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    };

    const handleInfoClick = (user) => {
        setSelectedUser(user);
        setShowInfoModal(true);
    };

    const toggleBanStatus = (userId, isBanned) => {
        const endpoint = isBanned ? `unban` : `ban`;
        fetch(`http://localhost:8080/api/user/${endpoint}/${userId}`, { method: 'PUT' })
            .then(response => {
                if (response.ok) {
                    fetchUsers(); // Refresh user list after ban/unban action
                } else {
                    console.error('Error updating user ban status');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className='admin'>
            <Sidebar />
            <div className='admin-wrapper'>
                <AdminNavbar />
                <div className='admin__products'>
                    <div className='filter__input'>
                        <input
                            type="text"
                            placeholder="Filter by username"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                    </div>
                    <div className='admin__products-wrapper'>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <AdminUserItem 
                                    key={user.id}
                                    name={user.username}
                                    isBanned={user.isBanned}
                                    onInfoClick={() => handleInfoClick(user)}
                                    onBanToggle={() => toggleBanStatus(user.id, user.isBanned)}
                                />
                            ))
                        ) : (
                            <p>No users found</p>
                        )}
                    </div>
                </div>
            </div>
            {showInfoModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>User Information</h2>
                        <p>First Name: {selectedUser.firstName}</p>
                        <p>Last Name: {selectedUser.lastName}</p>
                        <p>Username: {selectedUser.username}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Phone Number: {selectedUser.phoneNumber}</p>
                        <button onClick={() => setShowInfoModal(false)}>Close Modal</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;
