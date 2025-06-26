import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/BookingSummary.css';

const BookingSummary = () => {
  const [tickets, setTickets] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/productsapi/booking-summary/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setTickets(response.data.tickets);
        setTotalPrice(response.data.total_price);
        setMessage('');
      } catch (error) {
        console.error('Failed to fetch booking summary:', error);
        setMessage('❌ Failed to load booking summary.');
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="booking-summary-bg py-5">
      <div className="container text-white">
        <div className="glass-box p-4">
          <h1 className="text-center mb-4 text-glow">🎟 Booking Summary</h1>

          {message && <div className="alert alert-danger">{message}</div>}

          <div className="table-responsive">
            <table className="table table-striped table-hover bg-light text-dark rounded shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Concert</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Price (per ticket)</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length > 0 ? (
                  tickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td>{index + 1}</td>
                      <td>{ticket.concert.name}</td>
                      <td>{ticket.concert.venue}</td>
                      <td>{new Date(ticket.concert.date_time).toLocaleString()}</td>
                      <td>{ticket.quantity}</td>
                      <td>₹{ticket.concert.ticket_price}</td>
                      <td>₹{ticket.quantity * ticket.concert.ticket_price}</td>
                      <td>
                        <span className={`badge ${ticket.canceled ? 'bg-danger' : 'bg-success'}`}>
                          {ticket.canceled ? 'Canceled' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No tickets found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <h4 className="fw-bold text-glow">Total Spent: ₹{totalPrice}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
