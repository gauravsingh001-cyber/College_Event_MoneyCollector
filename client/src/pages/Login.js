import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';
import '../styles/AuthForms.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '891943493643-b6tjlh26gm0qqabmvs6l2sbpr2n405h9.apps.googleusercontent.com', // You need to replace with actual Google Client ID
          callback: handleGoogleSignIn
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    setError('');
    setLoading(true);

    try {
      // Send Google token to backend for verification
      const result = await apiCall('/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ token: response.credential })
      });

      localStorage.setItem('token', result.token);
      onLogin(result.user, result.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('token', response.token);
      onLogin(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: '#999', fontSize: '14px' }}>OR</p>
        </div>

        <div 
          id="googleSignInButton" 
          style={{ 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}
        ></div>

        <p style={{ textAlign: 'center', color: '#666' }}>
          Don't have an account? <a href="/register" style={{ color: '#667eea', fontWeight: '600' }}>Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
