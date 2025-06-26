import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/CancelTicket.css'; // Custom CSS for styles and background

const CancelTicket = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/productsapi/tickets/${ticketId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setTicket(response.data);
      } catch (error) {
        console.error(error);
        setMessage('❌ Failed to load ticket details.');
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/productsapi/tickets/${ticketId}/cancel/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setMessage('✅ Ticket cancelled successfully!');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (error) {
      console.error(error);
      setMessage('❌ Ticket cancellation failed.');
    }
  };

  return (
    <div className="cancel-ticket-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="glass-box text-white p-4 rounded-4 shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <h3 className="text-danger mb-3"><i className="fas fa-ban"></i> Cancel Ticket</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {ticket ? (
          <>
            <p>
              Are you sure you want to cancel your ticket for <strong>{ticket.concert_name}</strong> scheduled on{' '}
              <strong>{new Date(ticket.concert_date).toLocaleString()}</strong> at <strong>{ticket.venue}</strong>?
            </p>
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-danger px-4" onClick={handleCancel}>
                <i className="fas fa-check-circle"></i> Yes, Cancel
              </button>
              <button className="btn btn-secondary px-4" onClick={() => navigate('/my-bookings')}>
                <i className="fas fa-times-circle"></i> No, Go Back
              </button>
            </div>
          </>
        ) : (
          <p>Loading ticket info...</p>
        )}
      </div>
    </div>
  );
};

export default CancelTicket;
