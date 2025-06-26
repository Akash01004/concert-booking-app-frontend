import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState('');
  const [strengthClass, setStrengthClass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const baseURL = 'http://localhost:8000/productsapi/register/'; // Change this to your real API

  useEffect(() => {
    document.body.className = 'register-body';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password1') {
      updateStrength(value);
    }
  };

  const updateStrength = (password) => {
    let label = 'Weak';
    let cssClass = 'text-danger';

    if (password.length > 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      label = 'Strong';
      cssClass = 'text-success';
    } else if (password.length > 6) {
      label = 'Medium';
      cssClass = 'text-warning';
    }

    setStrength(label);
    setStrengthClass(cssClass);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(baseURL, formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(response.data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      const errors = err.response?.data;

      if (errors) {
        const firstError = Object.values(errors)[0][0];
        setError(firstError);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2><i className="fas fa-music me-2"></i>Create Your Account</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert text-center">{error}</div>}

          <div className="mb-3 position-relative w-100">
            <label className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3 position-relative w-100">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-envelope"></i></span>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3 position-relative w-100">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password1"
                className="form-control"
                placeholder="Enter password"
                required
                value={formData.password1}
                onChange={handleChange}
              />
              <i
                className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-icon`}
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className={`password-strength ${strengthClass}`}>{strength}</div>
          </div>

          <div className="mb-3 position-relative w-100">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                type="password"
                name="password2"
                className="form-control"
                placeholder="Confirm password"
                required
                value={formData.password2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login here</a>.
        </p>
        <p className="text-center mt-2">
          <a href="/">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
