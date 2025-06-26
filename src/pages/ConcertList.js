import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/ConcertList.css'; 

const ConcertList = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/productsapi/concerts/');
        setConcerts(response.data);
      } catch (err) {
        setError('Failed to load concerts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  if (loading) return <div className="text-center mt-5 text-light">Loading concerts...</div>;
  if (error) return <div className="alert alert-danger mt-5 text-center">{error}</div>;

  return (
    <div className="concert-list-bg">
      <div className="container py-5">
      <h1 className="fw-bold text-dark">
      <i className="fa-solid fa-guitar me-2"></i> THE CONCERTS
      </h1>
        <div className="text-end mb-4">
          <Link to="/createconcert" className="btn btn-success shadow">
            <i className="fa fa-plus"></i> Create New Concert
          </Link>
        </div>

        {concerts.length === 0 ? (
          <p className="text-white text-center">No concerts available.</p>
        ) : (
          <div className="row">
            {concerts.map((concert) => (
              <div className="col-md-4 mb-4" key={concert.id}>
                <div className="concert-card glass-card text-white h-100">
                  {concert.image && (
                    <img
                      src={concert.image}
                       alt={concert.name}
                      className="card-img-top"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{concert.name}</h5>
                    <p className="card-text">
                      <strong>Venue:</strong> {concert.venue}<br />
                      <strong>Date & Time:</strong> {new Date(concert.date_time).toLocaleString()}<br />
                      <strong>Price:</strong> ₹{concert.ticket_price}<br />
                      <strong>Tickets:</strong> {concert.available_tickets}
                    </p>
                    <div className="d-flex justify-content-end">
                      <Link to={`/concerts/${concert.id}/update`} className="btn btn-warning btn-sm me-2">
                        <i className="fa fa-edit"></i> Edit
                      </Link>
                      <Link to={`/concerts/${concert.id}/delete`} className="btn btn-danger btn-sm me-2">
                        <i className="fa fa-trash"></i> Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <Link to="/admin-dashboard" className="btn btn-outline-light shadow">
            <i className="fa fa-arrow-left"></i> Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConcertList;
