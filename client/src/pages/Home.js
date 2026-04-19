import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';
import '../styles/Home.css';

const Home = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const url = filter ? `/events?status=${filter}` : '/events';
      const response = await apiCall(url);
      setEvents(response.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>College Events</h1>
            <p>Discover and participate in amazing events</p>
          </div>
          {user && user.role === 'organizer' && (
            <button 
              onClick={() => navigate('/organizer-dashboard')}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
            >
              ✨ Create Event
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <button
          className={filter === '' ? 'active' : ''}
          onClick={() => setFilter('')}
        >
          All Events
        </button>
        <button
          className={filter === 'upcoming' ? 'active' : ''}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={filter === 'ongoing' ? 'active' : ''}
          onClick={() => setFilter('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!loading && <h2 className="events-heading">Discover Events</h2>}

      {loading && <p style={{ textAlign: 'center', padding: '40px' }}>Loading events...</p>}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div>
              <span className={`status-badge ${event.status}`}>{event.status}</span>
              <h3>{event.title}</h3>
              <p>{event.description.substring(0, 100)}...</p>
              <p><strong>📍 Venue:</strong> {event.venue}</p>
              <p><strong>🏷️ Category:</strong> {event.category}</p>
              <p><strong>💰 Fee:</strong> Rs. {event.registrationFee}</p>
            </div>
            <button onClick={() => handleEventClick(event._id)}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {!loading && events.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No events found</p>
      )}
    </div>
  );
};

export default Home;
