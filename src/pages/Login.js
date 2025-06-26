import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // import Link
import axios from 'axios';
import '../style/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/productsapi/login/', {
        username,
        password
      });

      const { token, is_superuser } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('is_superuser', is_superuser);

      // Redirect based on role
      if (is_superuser) {
        navigate('/admin-dashboard');
      } else {
        navigate('/userconcerts');
      }

    } catch (error) {
      setMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {message && <div className="alert text-center">{message}</div>}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid mt-4 mb-3">
            <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
        <p className="text-center">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
