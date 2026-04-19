import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';
import '../styles/AuthForms.css';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'participant',
    rollNumber: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
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
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="participant">Participant (Student)</option>
            <option value="organizer">Organizer</option>
          </select>

          {formData.role === 'participant' && (
            <>
              <input
                type="text"
                name="rollNumber"
                placeholder="Class Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department/Branch"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
};

export default Register;
