import React, { useState, useEffect } from 'react';
import apiCall from '../utils/api';
import '../styles/PaymentCollection.css';

const PaymentCollection = () => {
  const [paymentId, setPaymentId] = useState('');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [collecting, setCollecting] = useState(false);

  const handleSearchPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPayment(null);

    try {
      const response = await apiCall(`/payments/${paymentId}`);
      setPayment(response.payment);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectPayment = async () => {
    setCollecting(true);
    setError('');

    try {
      await apiCall('/payments/collect', {
        method: 'POST',
        body: JSON.stringify({ paymentId })
      });
      alert('Payment collected successfully!');
      setPaymentId('');
      setPayment(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCollecting(false);
    }
  };

  return (
    <div className="payment-collection">
      <h1>Payment Collection</h1>

      <div className="search-form">
        <form onSubmit={handleSearchPayment}>
          <input
            type="text"
            placeholder="Enter Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {payment && (
        <div className="payment-details">
          <h2>Payment Details</h2>
          <table className="details-table">
            <tbody>
              <tr>
                <td><strong>Payment ID:</strong></td>
                <td>{payment._id}</td>
              </tr>
              <tr>
                <td><strong>Amount:</strong></td>
                <td>Rs. {payment.amount}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>{payment.status}</td>
              </tr>
              <tr>
                <td><strong>Participant:</strong></td>
                <td>{payment.participant?.user?.name}</td>
              </tr>
              <tr>
                <td><strong>Event:</strong></td>
                <td>{payment.event?.title}</td>
              </tr>
            </tbody>
          </table>

          {payment.qrCodeData && (
            <div className="qr-section">
              <h3>QR Code</h3>
              <img src={payment.qrCodeData} alt="QR Code" />
            </div>
          )}

          {payment.status !== 'completed' && (
            <button
              className="collect-btn"
              onClick={handleCollectPayment}
              disabled={collecting}
            >
              {collecting ? 'Collecting...' : 'Collect Payment'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentCollection;
