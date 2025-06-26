import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/UserBookingSummary.css';

export default function UserBookingSummary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    axios.get('http://127.0.0.1:8000/productsapi/users/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data || err.message || 'Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="ubs-loading">Loading user bookings...</p>;
  if (error) return <p className="ubs-error">Error: {error}</p>;

  return (
    <div className="ubs-page">
      <div className="ubs-overlay">
        <div className="ubs-container">
          <div className="ubs-header">
            <h2 className="ubs-title">
              <i className="fa fa-users ubs-icon"></i>
              Users and Booked Tickets
            </h2>
            <a href="/admin-dashboard" className="ubs-back-button">
              <i className="fa fa-arrow-left ubs-icon"></i>
              Back to Dashboard
            </a>
          </div>

          {data.length === 0 ? (
            <div className="ubs-no-data">No users or bookings found.</div>
          ) : (
            <table className="ubs-table">
              <thead>
                <tr className="ubs-table-header-row">
                  <th>User #</th>
                  <th>Username</th>
                  <th>Booked Concerts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, idx) => (
                  <tr key={user.username} className="ubs-table-row">
                    <td className="ubs-user-number">User {idx + 1}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.bookings.length > 0 ? (
                        <ul className="ubs-bookings-list">
                          {user.bookings.map((b, i) => (
                            <li key={i} className="ubs-booking-item">
                              🎵 {b.concert__name} – {b.total_tickets} ticket{b.total_tickets > 1 ? 's' : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em>No bookings</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
