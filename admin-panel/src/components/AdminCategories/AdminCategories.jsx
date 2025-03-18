import React from 'react'
import Sidebar from '../../containers/Asidebar/Sidebar';
import AdminNavbar from '../../containers/Anavbar/AdminNavbar';
import './adminCategories.css'

const AdminCategories = () => {
    return (
        <div className='admin'>
            <Sidebar />
            <div className='admin-wrapper'>
                <AdminNavbar />

          </div>
        </div>
    )
}

export default AdminCategories
