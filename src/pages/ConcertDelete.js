import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/ConcertDelete.css'; // ⬅️ Import the custom CSS

const ConcertDelete = () => {
  const { id } = useParams();
  const [concert, setConcert] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/productsapi/concerts/${id}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        setConcert(response.data);
      } catch (err) {
        setError('Failed to load concert details');
        console.error(err.response?.data || err.message);
      }
    };

    fetchConcert();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/productsapi/concerts/${id}/delete/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      navigate('/concertlist');
    } catch (err) {
      setError('Failed to delete concert');
      console.error(err.response?.data || err.message);
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  if (!concert) {
    return <div className="text-center mt-5 text-light">Loading concert...</div>;
  }

  return (
    <div className="concert-delete-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="glass-box p-5 text-center w-100" style={{ maxWidth: '600px' }}>
          <h2 className="text-glow mb-4">
            <i className="fa fa-calendar-times me-2"></i> Delete Concert
          </h2>

          <div className="alert alert-danger text-start">
            <h4>
              Are you sure you want to delete <strong>"{concert.name}"</strong>?
            </h4>
            <p><strong>Date & Time:</strong> {new Date(concert.date_time).toLocaleString()}</p>
            <p><strong>Venue:</strong> {concert.venue}</p>

            {/* ✅ Concert Image Preview */}
            {concert.image && (
              <div className="text-center mt-3">
                <img
                  src={`http://localhost:8000/${concert.image}`}
                  alt="Concert"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-danger px-4" onClick={handleDelete}>
              <i className="fa fa-trash"></i> Delete
            </button>
            <button className="btn btn-outline-light px-4" onClick={() => navigate('/concertlist')}>
              <i className="fa fa-times"></i> Cancel
            </button>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-warning" onClick={() => navigate('/ConcertList')}>
              <i className="fa fa-arrow-left"></i> Back to Concert list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertDelete;
