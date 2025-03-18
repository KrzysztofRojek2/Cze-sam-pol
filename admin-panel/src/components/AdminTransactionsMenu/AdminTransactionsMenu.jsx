import React from 'react'
import './adminTransactionsMenu.css'
import Sidebar from '../Asidebar/Sidebar'
import AdminNavbar from '../Anavbar/AdminNavbar';
import { Link } from 'react-router-dom'

const AdminTransactionsMenu = () => {
  return (
    <div className='admin'>
        <Sidebar />
        <div className='admin-wrapper'>
            <AdminNavbar />
            <div className='admin__transactions-menu-wrapper'>
            <Link to={`/admin-transactions/approved`}>
                  <div className='admin__option'>
                      <p>Approved Transactions</p>
                  </div>
                </Link>
                <Link to={`/admin-transactions/awaiting`}>
                  <div className='admin__option'>
                      <p>Awaiting Approval</p>
                  </div>
                </Link>
            </div>
      </div>
    </div>
  )
}

export default AdminTransactionsMenu
