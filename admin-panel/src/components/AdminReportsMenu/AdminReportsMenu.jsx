import React, { useState, useEffect } from 'react';
import Sidebar from '../Asidebar/Sidebar';
import AdminNavbar from '../Anavbar/AdminNavbar';
import './adminReportsMenu.css';

const AdminReportsMenu = () => {
    const [reports, setReports] = useState([]);

    const endpoint = 'http://localhost:8080/api/error-reports'; // Endpoint dla raportów błędów

    useEffect(() => {
        fetch(endpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching reports');
                }
                return response.json();
            })
            .then(data => {
                setReports(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching reports:', error));
    }, []);

    const handleResolveReport = (reportId) => {
        fetch(`http://localhost:8080/api/error-reports/resolve/${reportId}`, {
            method: 'POST',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to resolve report');
                }
                return response.json();
            })
            .then((resolvedReport) => {
                setReports((prevReports) =>
                    prevReports.map((report) =>
                        report.id === resolvedReport.id ? { ...report, status: 'RESOLVED' } : report
                    )
                );
            })
            .catch(error => console.error('Error resolving report:', error));
    };

    return (
        <div className="admin">
            <Sidebar />
            <div className="admin-wrapper">
                <AdminNavbar />
                <div className="admin__reports">
                    <h2>Reports</h2>
                    <div className="reports-list">
                        {reports.map((report) => (
                            <div key={report.id} className="report-card">
                                <h3>Report ID: {report.id}</h3>
                                <p>Description: {report.description}</p>
                                <p>User ID: {report.userId}</p>
                                {report.image && (
                                    <img
                                        src={`data:image/jpeg;base64,${report.image}`}
                                        alt="Report"
                                        className="report-image"
                                    />
                                )}
                                <p>Status: {report.status}</p>
                                {report.status !== 'RESOLVED' && (
                                    <button
                                        className="resolve-button"
                                        onClick={() => handleResolveReport(report.id)}
                                    >
                                        Resolve
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReportsMenu;
