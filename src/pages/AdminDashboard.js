import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [concerts, setConcerts] = useState([]);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcerts = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('username');
      setUsername(user);

      try {
        const response = await axios.get('http://localhost:8000/productsapi/concerts/', {
          headers: { Authorization: `Token ${token}` }
        });
        setConcerts(response.data);
      } catch (error) {
        console.error("Error fetching concerts:", error.response?.data || error.message);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="container dashboard-card mt-5 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-warning"><i className="fa fa-user-shield me-2"></i>Admin Dashboard</h2>
          <span className="badge bg-info text-dark px-3 py-2 rounded">👋 Welcome, {username}</span>
        </div>

        <div className="header-link mb-4 d-flex flex-wrap gap-2">
          <button className="btn btn-outline-light" onClick={() => navigate('/concertlist')}>
            <i className="fa fa-music me-1"></i> Manage Concerts
          </button>
          <button className="btn btn-outline-light" onClick={() => navigate('/userbookingsummary')}>
            <i className="fa fa-users"></i> Users
          </button>
         <button className="btn btn-outline-danger" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            <i className="fa fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>

        <h4 className="text-success mb-3">🎵 Concert Management</h4>

        {concerts.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-bordered table-hover align-middle">
              <thead className="table-secondary text-dark">
                <tr>
                   <th>#</th>
                  <th>Name</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>ID</th>
                  <th>Price (₹)</th>
                  <th>Available Tickets</th>
                </tr>
              </thead>
              <tbody>
               {concerts.map((concert, index) => ( 
              <tr key={concert.id}>
                 <td>{index + 1}</td>  
                 <td>{concert.name}</td>
                 <td>{new Date(concert.date_time).toLocaleString()}</td>
                 <td>{concert.venue}</td>
                 <td>{concert.id}</td>
                 <td>{concert.ticket_price}</td>
                 <td>{concert.available_tickets}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info text-white text-center mt-4">
            No concerts available. <span
              className="alert-link text-warning"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/createconcert')}
            >
              Click here to create one.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
