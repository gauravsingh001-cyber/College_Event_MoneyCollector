import React, { useState, useEffect } from 'react';
import apiCall from '../utils/api';
import '../styles/MyParticipations.css';

const MyParticipations = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiCall('/participants/my-participations');
      setParticipations(response.participants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      default:
        return '#999';
    }
  };

  if (loading) return <p>Loading participations...</p>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-participations">
      <h1>My Event Registrations</h1>

      {participations.length === 0 ? (
        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          You haven't registered for any events yet
        </p>
      ) : (
        <div className="participations-grid">
          {participations.map((participation) => (
            <div 
              key={participation._id} 
              className="participation-card"
              style={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                background: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              <h3 style={{ color: '#333', marginBottom: '10px' }}>
                {participation.event.title}
              </h3>
              
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
                <strong>Event Date:</strong> {new Date(participation.event.startDate).toLocaleDateString()}
              </p>

              <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
                <strong>Registered:</strong> {new Date(participation.registrationDate).toLocaleDateString()}
              </p>

              <p style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
                <strong>Fee:</strong> Rs. {participation.event.registrationFee}
              </p>

              <div className="status-badges" style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <span 
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: getStatusColor(participation.status),
                    color: 'white'
                  }}
                >
                  {participation.status === 'pending' && '⏳ Pending Approval'}
                  {participation.status === 'approved' && '✅ Approved'}
                  {participation.status === 'rejected' && '❌ Rejected'}
                </span>

                <span 
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: participation.paymentStatus === 'completed' ? '#4caf50' : '#ff9800',
                    color: 'white'
                  }}
                >
                  {participation.paymentStatus === 'completed' ? '💰 Payment Done' : '💳 Payment Pending'}
                </span>
              </div>

              {participation.status === 'approved' && participation.event.paymentMethod && (
                <div style={{
                  padding: '15px',
                  background: '#f0f7ff',
                  borderLeft: '4px solid #667eea',
                  borderRadius: '6px',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ color: '#667eea', marginBottom: '10px', fontSize: '14px' }}>
                    Payment Details
                  </h4>
                  
                  {participation.event.paymentMethod === 'phone' && participation.event.paymentPhoneNumber && (
                    <div>
                      <p style={{ color: '#333', fontSize: '13px', marginBottom: '5px' }}>
                        <strong>Phone Number:</strong>
                      </p>
                      <p style={{ 
                        color: '#667eea', 
                        fontSize: '16px', 
                        fontWeight: '700',
                        padding: '10px',
                        background: '#fff',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        {participation.event.paymentPhoneNumber}
                      </p>
                      <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        Send Rs. {participation.event.registrationFee} via UPI, phone pay or bank transfer
                      </p>
                    </div>
                  )}

                  {participation.event.paymentMethod === 'qr' && participation.event.paymentQRCode && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
                        Scan to make payment:
                      </p>
                      <img 
                        src={participation.event.paymentQRCode} 
                        alt="Payment QR Code"
                        style={{
                          maxWidth: '180px',
                          border: '2px solid #667eea',
                          borderRadius: '6px',
                          padding: '8px',
                          background: '#fff'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {participation.status === 'pending' && (
                <div style={{
                  padding: '12px',
                  background: '#fff3cd',
                  borderRadius: '6px',
                  color: '#856404',
                  fontSize: '12px',
                  marginBottom: '15px'
                }}>
                  ⏳ Waiting for organizer approval. Payment details will be shown once approved.
                </div>
              )}

              {participation.status === 'rejected' && (
                <div style={{
                  padding: '12px',
                  background: '#f8d7da',
                  borderRadius: '6px',
                  color: '#721c24',
                  fontSize: '12px'
                }}>
                  ❌ Your registration was rejected. Please contact the organizer.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyParticipations;
