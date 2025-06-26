// src/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_superuser');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #1e1e2f, #111122)', padding: '0.8rem 2rem' }}>
      <Link className="navbar-brand text-success fw-bold" to="/userconcerts">
        ConcertBooking
      </Link>

      <div className="navbar-nav me-auto">
        <Link className="nav-link" to="/userconcerts">
          <i className="bi bi-house-door-fill me-1"></i> Dashboard
        </Link>
        <Link className="nav-link" to="/my-bookings">
          <i className="bi bi-calendar2-check-fill me-1"></i> My Bookings
        </Link>
      </div>

      {isAuthenticated && (
        <div className="d-flex align-items-center">
          <div className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-white"
              href="#!"
              id="profileDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-circle me-1"></i> Account
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
