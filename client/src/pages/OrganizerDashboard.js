import React, { useState, useEffect } from 'react';
import apiCall from '../utils/api';
import '../styles/OrganizerDashboard.css';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [pendingParticipants, setPendingParticipants] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    venue: '',
    startDate: '',
    endDate: '',
    registrationFee: '',
    maxParticipants: '',
    paymentMethod: 'phone',
    paymentPhoneNumber: '',
    paymentQRCode: '',
    paymentQRCodePreview: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiCall('/events/organizer/my-events');
      setEvents(response.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingParticipants = async (eventId) => {
    setLoading(true);
    try {
      const response = await apiCall(`/participants/pending/${eventId}`);
      setPendingParticipants(response.participants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQRImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          paymentQRCode: reader.result, // Store base64 encoded image
          paymentQRCodePreview: reader.result // For preview
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const loadEventForEdit = (event) => {
    setEditingEventId(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      startDate: event.startDate.slice(0, 16), // Convert to datetime-local format
      endDate: event.endDate.slice(0, 16),
      registrationFee: event.registrationFee,
      maxParticipants: event.maxParticipants,
      paymentMethod: event.paymentMethod || 'phone',
      paymentPhoneNumber: event.paymentPhoneNumber || '',
      paymentQRCode: event.paymentQRCode || '',
      paymentQRCodePreview: event.paymentQRCode || '' // For preview
    });
    setView('create');
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      description: '',
      category: 'technical',
      venue: '',
      startDate: '',
      endDate: '',
      registrationFee: '',
      maxParticipants: '',
      paymentMethod: 'phone',
      paymentPhoneNumber: '',
      paymentQRCode: '',
      paymentQRCodePreview: ''
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');

    // Validate payment method fields
    if (formData.paymentMethod === 'phone' && !formData.paymentPhoneNumber) {
      setError('Please provide a phone number for payment');
      return;
    }
    if (formData.paymentMethod === 'qr' && !formData.paymentQRCode) {
      setError('Please upload or provide QR code for payment');
      return;
    }

    try {
      if (editingEventId) {
        // Update existing event
        await apiCall(`/events/${editingEventId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        alert('Event updated successfully!');
        cancelEdit();
      } else {
        // Create new event
        await apiCall('/events', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        alert('Event created successfully!');
        setFormData({
          title: '',
          description: '',
          category: 'technical',
          venue: '',
          startDate: '',
          endDate: '',
          registrationFee: '',
          maxParticipants: '',
          paymentMethod: 'phone',
          paymentPhoneNumber: '',
          paymentQRCode: ''
        });
      }
      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEventSelect = async (eventId) => {
    setSelectedEvent(eventId);
    await fetchPendingParticipants(eventId);
  };

  const handleApproveParticipant = async (participantId) => {
    try {
      await apiCall(`/participants/${participantId}/approve`, {
        method: 'PUT',
        body: JSON.stringify({})
      });
      alert('Participant approved!');
      await fetchPendingParticipants(selectedEvent);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleRejectParticipant = async (participantId) => {
    if (window.confirm('Are you sure you want to reject this participant?')) {
      try {
        await apiCall(`/participants/${participantId}/reject`, {
          method: 'PUT',
          body: JSON.stringify({})
        });
        alert('Participant rejected!');
        await fetchPendingParticipants(selectedEvent);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="organizer-dashboard">
      <h1>Organizer Dashboard</h1>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => { setView('create'); cancelEdit(); }}
          style={{ 
            padding: '10px 20px',
            background: view === 'create' ? '#667eea' : '#ddd',
            color: view === 'create' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Create Event
        </button>
        <button 
          onClick={() => setView('my-events')}
          style={{ 
            padding: '10px 20px',
            background: view === 'my-events' ? '#667eea' : '#ddd',
            color: view === 'my-events' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          My Events
        </button>
        <button 
          onClick={() => setView('manage')}
          style={{ 
            padding: '10px 20px',
            background: view === 'manage' ? '#667eea' : '#ddd',
            color: view === 'manage' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Manage Registrations
        </button>
      </div>

      {view === 'create' && (
        <div className="create-event-section">
          <h2>{editingEventId ? '✏️ Edit Event' : 'Create New Event'}</h2>
          {error && <div className="error-message">{error}</div>}
          {editingEventId && (
            <button 
              onClick={cancelEdit}
              style={{
                marginBottom: '15px',
                padding: '8px 15px',
                background: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              ← Cancel Edit
            </button>
          )}
          <form className="create-form" onSubmit={handleCreateEvent}>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleFormChange}
              required
            ></textarea>
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
            >
              <option value="technical">Technical</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={handleFormChange}
              required
            />
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleFormChange}
              required
            />
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleFormChange}
              required
            />
            <input
              type="number"
              name="registrationFee"
              placeholder="Registration Fee (Rs.)"
              value={formData.registrationFee}
              onChange={handleFormChange}
              required
            />
            <input
              type="number"
              name="maxParticipants"
              placeholder="Max Participants"
              value={formData.maxParticipants}
              onChange={handleFormChange}
              required
            />

            <h3 style={{ marginTop: '20px', color: '#333', fontSize: '16px' }}>Payment Method *</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Choose payment method and provide required details</p>
            
            <label style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', padding: '12px', background: formData.paymentMethod === 'phone' ? '#f0f4ff' : '#f9f9f9', borderRadius: '8px' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="phone"
                checked={formData.paymentMethod === 'phone'}
                onChange={handleFormChange}
              />
              <span style={{ fontWeight: '600', color: '#333' }}>Phone Number for Payment</span>
            </label>

            {formData.paymentMethod === 'phone' && (
              <input
                type="tel"
                name="paymentPhoneNumber"
                placeholder="Your Payment Phone Number (e.g., 9876543210) *"
                value={formData.paymentPhoneNumber}
                onChange={handleFormChange}
                style={{ marginBottom: '15px', borderColor: !formData.paymentPhoneNumber ? '#ff6b6b' : '#ddd' }}
              />
            )}

            <label style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', padding: '12px', background: formData.paymentMethod === 'qr' ? '#f0f4ff' : '#f9f9f9', borderRadius: '8px' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="qr"
                checked={formData.paymentMethod === 'qr'}
                onChange={handleFormChange}
              />
              <span style={{ fontWeight: '600', color: '#333' }}>QR Code for Payment (Recommended)</span>
            </label>

            {formData.paymentMethod === 'qr' && (
              <div style={{ marginBottom: '15px', padding: '15px', background: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107' }}>
                <p style={{ color: '#856404', marginBottom: '10px', fontWeight: '600' }}>📱 QR Code for Payment</p>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>Upload QR code image from your device or paste a link</p>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block',
                    padding: '20px',
                    border: '2px dashed #ffc107',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#fffbf0',
                    transition: 'all 0.3s ease'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQRImageUpload}
                      style={{ display: 'none' }}
                    />
                    <p style={{ color: '#856404', marginBottom: '5px', fontWeight: '600' }}>
                      📁 Click to upload QR code image
                    </p>
                    <p style={{ color: '#999', fontSize: '12px' }}>
                      PNG, JPG, JPEG (Max 2MB)
                    </p>
                  </label>
                </div>

                <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
                  <strong>OR</strong>
                </p>

                <input
                  type="text"
                  name="paymentQRCode"
                  placeholder="Paste QR Code image URL (e.g., https://example.com/qr.png)"
                  value={formData.paymentQRCode}
                  onChange={handleFormChange}
                  style={{ marginBottom: '15px' }}
                />

                {formData.paymentQRCodePreview && (
                  <div style={{ 
                    padding: '15px', 
                    background: '#fff', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
                      ✅ QR Code Preview:
                    </p>
                    <img 
                      src={formData.paymentQRCodePreview} 
                      alt="QR Code Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        border: '2px solid #667eea',
                        borderRadius: '6px',
                        padding: '8px'
                      }}
                    />
                  </div>
                )}

                <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>
                  Note: Students will see this QR code when they register to make payment
                </p>
              </div>
            )}

            <button type="submit" style={{ marginTop: '20px' }}>{editingEventId ? 'Update Event' : 'Create Event'}</button>
          </form>
        </div>
      )}

      {view === 'my-events' && (
        <div className="my-events-section">
          <h2>My Events</h2>
          {loading && <p>Loading...</p>}
          {error && <div className="error-message">{error}</div>}
          {events.length === 0 && !loading && <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No events created yet</p>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {events.map((event) => (
              <div key={event._id} style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{event.title}</h3>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '5px' }}>
                  <strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}
                </p>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '5px' }}>
                  <strong>Venue:</strong> {event.venue}
                </p>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '5px' }}>
                  <strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}
                </p>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
                  <strong>Fee:</strong> Rs. {event.registrationFee}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => loadEventForEdit(event)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this event?')) {
                        try {
                          await apiCall(`/events/${event._id}`, { method: 'DELETE' });
                          alert('Event deleted successfully!');
                          fetchEvents();
                        } catch (err) {
                          alert('Error: ' + err.message);
                        }
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'manage' && (
        <div className="manage-section">
          <h2>Manage Events & Participants</h2>
          
          <div className="events-section">
            <h3>My Events</h3>
            {loading && <p>Loading...</p>}
            {events.length === 0 && !loading && <p>No events created yet</p>}
            <div className="events-list">
              {events.map((event) => (
                <button
                  key={event._id}
                  className={`event-item ${selectedEvent === event._id ? 'active' : ''}`}
                  onClick={() => handleEventSelect(event._id)}
                >
                  {event.title}
                </button>
              ))}
            </div>
          </div>

          {selectedEvent && (
            <div className="participants-section">
              <h3>Pending Registrations ({pendingParticipants.length})</h3>
              
              {pendingParticipants.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No pending registrations
                </p>
              ) : (
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Roll Number</th>
                      <th>Department</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingParticipants.map((participant) => (
                      <tr key={participant._id}>
                        <td>{participant.user.name}</td>
                        <td>{participant.user.email}</td>
                        <td>{participant.user.phone}</td>
                        <td>{participant.rollNumber || 'N/A'}</td>
                        <td>{participant.department || 'N/A'}</td>
                        <td>
                          <button 
                            onClick={() => handleApproveParticipant(participant._id)}
                            style={{
                              padding: '6px 12px',
                              background: '#4facfe',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              marginRight: '8px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectParticipant(participant._id)}
                            style={{
                              padding: '6px 12px',
                              background: '#f5576c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
