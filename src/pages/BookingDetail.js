import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import '../style/BookingDetail.css';

const BookingDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/productsapi/tickets/${ticketId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setBooking(response.data);
      } catch (error) {
        console.error(error);
        setMessage('❌ Failed to load booking details.');
      }
    };

    fetchBookingDetails();
  }, [ticketId]);

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://localhost:8000/productsapi/tickets/${ticketId}/pdf/`,
        {
          headers: { Authorization: `Token ${token}` },
          responseType: 'blob', // Important for file downloads
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('❌ Failed to download PDF.');
    }
  };

  const qrData = booking
    ? `Ticket ID: ${booking.ticket_id}
Concert: ${booking.concert.name}
Quantity: ${booking.quantity}
Total Price: ₹${booking.total_price}`
    : '';

  return (
    <div className="booking-detail-bg d-flex justify-content-center align-items-center">
      <div className="glass-card text-white p-4 w-100" style={{ maxWidth: '700px', position: 'relative' }}>
        {/* Top right PDF download button */}
        <button
          onClick={handleDownloadPDF}
          className="btn btn-sm btn-warning"
          style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}
        >
          <i className="fa fa-download me-1"></i> PDF
        </button>

        <h3 className="text-glow text-center mb-4">
          <i className="fas fa-ticket-alt me-2"></i> Booking Details
        </h3>

        {message && <div className="alert alert-warning">{message}</div>}

        {booking ? (
          <>
            <h4 className="mb-3">{booking.concert.name}</h4>
            <p><strong>📍 Venue:</strong> {booking.concert.venue}</p>
            <p><strong>📅 Date & Time:</strong> {new Date(booking.concert.date_time).toLocaleString()}</p>

            <div className="mt-4 border-top pt-3">
              <h5 className="text-warning">🎟️ Booking Summary</h5>
              <p><strong>Ticket ID:</strong> {booking.ticket_id}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Total Price:</strong> ₹{booking.total_price}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>

            <div className="mt-4 border-top pt-3 text-center">
              <h5 className="text-warning">📲 Your QR Code</h5>
              <QRCodeCanvas value={qrData} size={200} bgColor="#ffffff" fgColor="#000000" />
            </div>

            <div className="mt-4 text-center">
              <button className="btn btn-outline-light" onClick={() => navigate('/my-bookings')}>
                <i className="fas fa-arrow-left me-2"></i> Back to My Bookings
              </button>
            </div>
          </>
        ) : (
          <p>Loading booking details...</p>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
