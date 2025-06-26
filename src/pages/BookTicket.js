import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/BookTicket.css';

const BookTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/productsapi/concerts/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setConcert(response.data);
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError('❌ Failed to load concert details.');
      }
    };

    fetchConcert();
  }, [id]);

  const handleBook = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');
      const token = localStorage.getItem('token');

      // Book the tickets
      await axios.post(
        `http://localhost:8000/productsapi/concerts/${id}/book/`,
        { quantity },
        {
          headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
        }
      );

      // Send email confirmation (background, silently)
      axios.post(
        `http://localhost:8000/api/send-booking-email/${id}/`,
        {},
        {
          headers: { Authorization: `Token ${token}` },
        }
      ).catch((emailError) => {
        console.warn('Email sending failed (ignored):', emailError);
      });

      setMessage('✅ Ticket booked successfully!');
      setTimeout(() => navigate('/UserConcerts'), 2000);
    } catch (bookingError) {
      console.error('Booking failed:', bookingError.response?.data || bookingError.message);
      setError(bookingError.response?.data?.error || '❌ Failed to book ticket.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-bg d-flex justify-content-center align-items-center">
      <div className="glass-form p-4 text-white w-100" style={{ maxWidth: '600px' }}>
        <h3 className="text-glow mb-3 text-center">
          <i className="fas fa-ticket-alt me-2"></i> Book Ticket
        </h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {concert ? (
          <>
            {concert.image && (
              <img
                src={`http://localhost:8000${concert.image}`}
                alt={concert.name}
                className="img-fluid rounded mb-3 w-100"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            )}

            <p className="mb-1">
              You're booking for <strong>{concert.name}</strong> at <strong>{concert.venue}</strong>
            </p>
            <p className="mb-1">📅 {new Date(concert.date_time).toLocaleString()}</p>
            <p className="mb-1">🎫 Price: ₹{concert.ticket_price}</p>

            <div className="mb-3 mt-3">
              <label className="form-label text-warning fw-bold">
                Number of Tickets (Max 3 per user)
              </label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                min="1"
                max={Math.min(3, concert.available_tickets)}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </div>

            <div className="d-flex gap-3 mt-4 justify-content-center">
              <button
                className="btn btn-warning"
                onClick={handleBook}
                disabled={loading || quantity < 1}
              >
                <i className="fas fa-check-circle me-1"></i>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              <button className="btn btn-outline-light" onClick={() => navigate('/UserConcerts')}>
                <i className="fas fa-times-circle me-1"></i> Cancel
              </button>
            </div>
          </>
        ) : (
          <p>Loading concert info...</p>
        )}
      </div>
    </div>
  );
};

export default BookTicket;
