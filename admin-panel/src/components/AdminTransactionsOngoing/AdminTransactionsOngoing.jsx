import React from 'react'
import './adminTransactionsOngoing.css'
import Sidebar from '../Asidebar/Sidebar'
import AdminNavbar from '../Anavbar/AdminNavbar';
import AdminTransactionObject from '../../components/adminTransactionObject/AdminTransactionObject'

const AdminTransactionsOngoing = () => {
    return (
        <div className='admin'>
          <Sidebar />
          <div className='admin-wrapper'>
            <AdminNavbar />
            <div className='admin__products'>
                <div className='admin__products-wrapper'>
                    <AdminTransactionObject />
                    <AdminTransactionObject />
                    <AdminTransactionObject />

                </div>
            </div>
          </div>
        </div>
      )
    }

export default AdminTransactionsOngoing
