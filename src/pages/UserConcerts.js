import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/UserConcerts.css';

function UserConcerts() {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcerts = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/productsapi/concerts/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setConcerts(response.data);
      } catch (err) {
        setError('Failed to load concerts. Please try again later.');
        console.error('Error fetching concerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  const handleBooking = (concertId) => {
    navigate(`/book-ticket/${concertId}`);
  };

  const filteredConcerts = concerts.filter((concert) =>
    concert.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading text-white text-center mt-5">Loading concerts...</div>;
  if (error) return <div className="error text-white text-center mt-5">{error}</div>;

  return (
    <div className="user-concerts-page">
      <div className="container concert-overlay mt-5">

        {/* Header with title, search and button */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h1 className="fw-bold text-success mb-3 mb-md-0">🎶 Available Concerts</h1>

          {/* Search + Button container */}
          <div className="d-flex align-items-center gap-2">
          <input
             type="text"
             placeholder="🔍 Search..."
             className="form-control bg-white text-dark px-2 py-1"
             style={{ width: '200px', fontSize: '0.9rem' }}
             value={search}
             onChange={(e) => setSearch(e.target.value)}
          />
         <button
    className="btn btn-info px-3 py-1"
    style={{ fontSize: '0.9rem' }}
    onClick={() => navigate('/booking-summary')}
  >
    📄 View Summary
  </button>
</div>
        </div>

        {/* Concerts grid */}
        {filteredConcerts.length > 0 ? (
          <div className="row g-4">
            {filteredConcerts.map((concert) => (
              <div className="col-md-6 col-lg-4" key={concert.id}>
                <div className="card concert-card shadow-sm h-100 rounded-4">
                  {concert.image ? (
                    <img
                       src={concert.image}
                       alt={concert.name}
                      className="card-img-top img-fluid"
                    
                      style={{
                        maxHeight: '200px',
                        width: '100%',
                        objectFit: 'cover',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                      }}
                    />
                    
                  ) : (
                    <div
                      className="bg-dark text-white d-flex align-items-center justify-content-center"
                      style={{ height: '200px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                    >
                      No Image Available
                    </div>
                  )}
                  

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{concert.name}</h5> 
                    <p className="text-muted">{concert.description?.slice(0, 120)}</p>
                    <ul className="list-unstyled mb-3 small">
                    <li>
                     <strong>🕒 Date & Time:</strong> {new Date(concert.date_time).toLocaleString()}
                    </li>
                      <li><strong>📍 Venue:</strong> {concert.venue}</li>
                      <li>
                        {concert.remaining_tickets === 0 && (
                         <span className="badge bg-danger ms-2">❌ Sold Out</span>
                        )}
                     </li>
                      <li><strong>💵 Price:</strong> ₹{concert.ticket_price}</li>
                    </ul>
                     <div className="d-flex justify-content-between text-warning fw-bold mt-3">
                      <p>📦 Ticket Available : {concert.available_capacity ?? concert.available_tickets}</p>
                    </div>

                    <div className="mt-auto">
                      {concert.remaining_tickets > 0 && concert.user_booked_tickets < 3 ? (
                        <button
                          onClick={() => handleBooking(concert.id)}
                          className="btn btn-primary w-100"
                        >
                          🎟 Book Ticket
                        </button>
                      ) : (
                        <div className="alert alert-warning text-center py-2 mt-2">
                          {concert.remaining_tickets === 0
                            ? '❌ Sold Out'
                            : '⚠️ Booking Limit Reached (Max 3)'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center mt-5 text-white">
            <h5>🚫 No concerts found.</h5>
            <p>Try searching for a different event.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserConcerts;
