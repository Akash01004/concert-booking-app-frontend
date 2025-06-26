import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:8000/productsapi/tickets/', {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: { search: searchQuery },
        });
        setBookings(response.data);
      } catch (error) {
        console.error(error);
        setMessage('❌ Failed to load your bookings.');
      }
    };

    fetchBookings();
  }, [searchQuery, token]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleViewDetails = (id) => navigate(`/book-detail/${id}`);
  const handleCancel = (id) => navigate(`/cancel-ticket/${id}`);

  return (
    <div className="my-bookings-bg py-5 px-3">
      <div className="container glass-container text-white p-4 rounded">
        <h1 className="text-center text-glow mb-4">
          <i className="fas fa-ticket-alt me-2"></i> My Bookings
        </h1>

        {message && <div className="alert alert-danger text-center">{message}</div>}

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by concert name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control search-bar"
          />
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-bordered table-hover align-middle">
            <thead className="table-secondary text-dark">
              <tr>
                <th>#</th>
                <th>Concert</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>View</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b, index) => (
                  <tr key={b.id}>
                    <td>{index + 1}</td>
                    <td>{b.concert?.name || 'N/A'}</td>
                    <td>{b.concert?.venue || 'N/A'}</td>
                    <td>{b.concert?.date_time ? new Date(b.concert.date_time).toLocaleString() : 'N/A'}</td>
                    <td>{b.quantity || 1}</td>
                    <td>₹{b.concert?.ticket_price || 'N/A'}</td>
                    <td>
                      <span className={`badge ${b.canceled ? 'bg-danger' : 'bg-success'}`}>
                        {b.canceled ? 'Canceled' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info" onClick={() => handleViewDetails(b.id)}>
                        View
                      </button>
                    </td>
                    <td>
                      {b.canceled ? (
                        <span className="text-muted">N/A</span>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b.id)}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
