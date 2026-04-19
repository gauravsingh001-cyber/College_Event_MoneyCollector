import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiCall from '../utils/api';
import '../styles/EventDetail.css';

const EventDetail = ({ user }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userParticipation, setUserParticipation] = useState(null);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiCall(`/events/${id}`);
      setEvent(response.event);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkUserRegistration = useCallback(async () => {
    try {
      const response = await apiCall('/participants/my-participations');
      const participation = response.participations.find(p => p.event._id === id);
      if (participation) {
        setUserParticipation(participation);
        setRegistered(true);
      }
    } catch (err) {
      // User not registered yet
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    if (user && user.role === 'participant') {
      checkUserRegistration();
    }
  }, [id, user, fetchEvent, checkUserRegistration]);

  const handleRegister = async () => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }

    setRegistering(true);
    setError('');

    try {
      // Register for event (with status pending)
      const regResponse = await apiCall('/participants/register', {
        method: 'POST',
        body: JSON.stringify({ 
          eventId: id,
          rollNumber: user.rollNumber || '',
          department: user.department || ''
        })
      });

      setUserParticipation(regResponse.participant);
      setRegistered(true);
      alert('Registration request submitted! Waiting for organizer approval.');
      fetchEvent();
    } catch (err) {
      setError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <p>Event not found</p>;

  return (
    <div className="event-detail-page">
      <div className="event-details">
        <h1>{event.title}</h1>
        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Description:</strong></td>
              <td>{event.description}</td>
            </tr>
            <tr>
              <td><strong>Venue:</strong></td>
              <td>{event.venue}</td>
            </tr>
            <tr>
              <td><strong>Category:</strong></td>
              <td>{event.category}</td>
            </tr>
            <tr>
              <td><strong>Start Date:</strong></td>
              <td>{new Date(event.startDate).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>End Date:</strong></td>
              <td>{new Date(event.endDate).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Registration Fee:</strong></td>
              <td>Rs. {event.registrationFee}</td>
            </tr>
            <tr>
              <td><strong>Participants:</strong></td>
              <td>{event.currentParticipants} / {event.maxParticipants}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>{event.status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="register-section">
        {!registered && user && user.role === 'participant' && (
          <>
            <button
              className="register-btn"
              onClick={handleRegister}
              disabled={registering || event.currentParticipants >= event.maxParticipants}
            >
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          </>
        )}

        {registered && userParticipation && (
          <div className="registration-status" style={{
            padding: '25px',
            background: '#f5f7ff',
            borderRadius: '15px',
            border: '2px solid #667eea'
          }}>
            <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Registration Submitted ✓</h3>
            
            <p style={{ color: '#666', marginBottom: '15px' }}>
              <strong>Status:</strong> {userParticipation.status === 'pending' ? '⏳ Waiting for approval' : userParticipation.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
            </p>

            {userParticipation.status === 'pending' && (
              <div style={{ padding: '15px', background: '#fff3cd', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ color: '#856404', fontSize: '14px' }}>
                  Your registration is awaiting organizer approval. They will review your request and send payment details once approved.
                </p>
              </div>
            )}

            {userParticipation.status === 'approved' && event.paymentMethod && (
              <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px', marginTop: '15px' }}>
                <h4 style={{ color: '#2e7d32', marginBottom: '15px' }}>💳 Payment Information</h4>
                
                {event.paymentMethod === 'phone' && event.paymentPhoneNumber && (
                  <div style={{
                    padding: '15px',
                    background: '#c8e6c9',
                    borderRadius: '8px',
                    borderLeft: '4px solid #2e7d32'
                  }}>
                    <p style={{ color: '#1b5e20', marginBottom: '5px' }}>
                      <strong>Phone Number:</strong>
                    </p>
                    <p style={{ color: '#1b5e20', fontSize: '18px', fontWeight: '700' }}>
                      {event.paymentPhoneNumber}
                    </p>
                    <p style={{ color: '#2e7d32', fontSize: '13px', marginTop: '10px' }}>
                      Please send Rs. {event.registrationFee} via UPI, phone pay or bank transfer to this number.
                    </p>
                  </div>
                )}

                {event.paymentMethod === 'qr' && event.paymentQRCode && (
                  <div style={{ textAlign: 'center', padding: '15px' }}>
                    <p style={{ color: '#2e7d32', marginBottom: '10px' }}>Scan the QR code below to make payment:</p>
                    <img 
                      src={event.paymentQRCode} 
                      alt="Payment QR Code"
                      style={{
                        maxWidth: '300px',
                        border: '3px solid #2e7d32',
                        borderRadius: '8px',
                        padding: '10px'
                      }}
                    />
                  </div>
                )}

                <p style={{ color: '#2e7d32', fontSize: '13px', marginTop: '15px', background: '#fff9c4', padding: '10px', borderRadius: '6px' }}>
                  📝 After payment, save the transaction receipt/screenshot for reference.
                </p>
              </div>
            )}

            {userParticipation.status === 'rejected' && (
              <div style={{ padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
                <p style={{ color: '#c62828' }}>
                  Unfortunately, your registration was rejected by the organizer. Please contact them for more information.
                </p>
              </div>
            )}
          </div>
        )}

        {(!user || user.role !== 'participant') && !registered && (
          <p style={{ padding: '15px', background: '#fff3cd', borderRadius: '8px', color: '#856404' }}>
            Only participants can register for events. Please login as a participant to register.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
