import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>College Event Organizer</h1>
        <div className="nav-menu">
          {user ? (
            <>
              <span className="user-info">Welcome, {user.name}</span>
              <a href="/">Events</a>
              {user.role === 'organizer' && (
                <a href="/organizer-dashboard">Organizer Dashboard</a>
              )}
              {user.role === 'admin' && (
                <>
                  <a href="/admin-dashboard">Admin Dashboard</a>
                  <a href="/payment-collection">Payment Collection</a>
                </>
              )}
              {user.role === 'participant' && (
                <a href="/my-participations">My Participations</a>
              )}
              <a href="/profile">Profile</a>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
