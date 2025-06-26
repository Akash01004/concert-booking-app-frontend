import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Home.css';

function Home({ isAuthenticated, username }) {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="overlay">
          <div className="hero-content text-white">
            <h1>🎤 Live Concerts, Festivals & More</h1>
            <p className="lead">Your gateway to unforgettable music experiences.</p>

            {isAuthenticated ? (
              <>
                <p>Welcome back, <strong>{username}</strong> 👋</p>
                <Link to="/dashboard" className="btn btn-success btn-custom">Dashboard</Link>
                <Link to="/logout" className="btn btn-outline-light btn-custom">Logout</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-custom">Login</Link>
                <Link to="/register" className="btn btn-outline-light btn-custom">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer bg-dark text-white text-center py-4">
        <div className="container">
          <h5>Contact Us</h5>
          <p>Email: <a href="mailto:support@liveconcerts.com" className="footer-link">support@liveconcerts.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="footer-link">+1 (234) 567-890</a></p>
          <p>Address: 123 Music Lane, Melody City, USA</p>
          <small>&copy; {new Date().getFullYear()} Live Concerts. All rights reserved.</small>
        </div>
      </footer>
    </div>
  );
}

export default Home;
