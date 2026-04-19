import React, { useState, useEffect } from 'react';
import apiCall from '../utils/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiCall('/payments/admin/dashboard');
      setDashboard(response.dashboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!dashboard) return <p>No data available</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Events</h3>
          <p className="metric-value">{dashboard.totalEvents}</p>
        </div>
        <div className="metric-card">
          <h3>Total Participants</h3>
          <p className="metric-value">{dashboard.totalParticipants}</p>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">Rs. {dashboard.totalRevenue}</p>
        </div>
        <div className="metric-card">
          <h3>Completed Payments</h3>
          <p className="metric-value">{dashboard.completedPayments}</p>
        </div>
        <div className="metric-card">
          <h3>Pending Payments</h3>
          <p className="metric-value">{dashboard.pendingPayments}</p>
        </div>
      </div>

      <div className="revenue-section">
        <h2>Event-wise Revenue</h2>
        <table className="revenue-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Total Revenue</th>
              <th>Current Participants</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.eventWiseRevenue.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>Rs. {event.totalRevenue}</td>
                <td>{event.currentParticipants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
