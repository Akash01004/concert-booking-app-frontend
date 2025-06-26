import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConcertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/productsapi/concerts/${id}/`);
        setConcert(response.data);
      } catch (error) {
        console.error('Error fetching concert:', error);
        setMessage('❌ Failed to load concert.');
      }
    };

    fetchConcert();
  }, [id]);

 const handleBook = async () => {
  try {
    await axios.post(
      `http://localhost:8000/productsapi/concerts/${id}/book/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );
    setMessage('🎟️ Ticket booked successfully!');
  } catch (error) {
    setMessage('❌ Booking failed. Please try again.');
    console.error(error);
  }
};

  if (!concert) {
    return <div className="text-white text-center mt-5">Loading concert details...</div>;
  }

  return (
    <div className="container mt-5 text-white">
      <h1 className="text-center mb-4 text-success">🎶 Discover Upcoming Concerts</h1>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4 bg-light text-dark">
            {concert.image && (
              <img
                 src={`http://localhost:8000/${concert.image}`} // Corrected string interpolation
                 className="card-img-top"
                 alt={concert.name}
                 style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            )}

            <div className="card-body">
              <h5 className="card-title text-primary">{concert.name}</h5>
              <p className="card-text text-muted">
                <strong>Date:</strong> {new Date(concert.date_time).toLocaleString()} <br />
                <strong>Venue:</strong> {concert.venue} <br />
                <strong>Price:</strong> ₹{concert.ticket_price} <br />
                <strong>Available Tickets:</strong> {concert.available_tickets}
              </p>

              <div className="d-flex justify-content-between align-items-center">
                {concert.available_tickets > 0 ? (
                  isLoggedIn ? (
                    <button className="btn btn-success btn-sm" onClick={handleBook}>
                      Book Now
                    </button>
                  ) : (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/login')}>
                      Login to Book
                    </button>
                  )
                ) : (
                  <span className="badge bg-danger">Sold Out</span>
                )}
              </div>

              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertDetail;
