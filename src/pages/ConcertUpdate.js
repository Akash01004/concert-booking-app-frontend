import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/ConcertUpdate.css'; 

const ConcertUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    date_time: '',
    venue: '',
    ticket_price: '',
    available_tickets: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConcert = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('❌ No token found. Please login.');
          return;
        }

        const response = await axios.get(`http://localhost:8000/productsapi/concerts/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = response.data;
        setFormData({
          name: data.name,
          date_time: data.date_time ? data.date_time.slice(0, 16) : '',
          venue: data.venue,
          ticket_price: data.ticket_price,
          available_tickets: data.available_tickets,
          image: null,
        });

        if (data.image) {
          setPreview(`http://localhost:8000/${data.image}`);
        }
      } catch (error) {
        console.error('❌ Fetch error:', error.response?.data || error.message);
        setMessage('❌ Failed to fetch concert data');
      }
    };

    fetchConcert();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        updateData.append(key, formData[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('❌ No token found. Please login.');
        return;
      }

      await axios.put(`http://localhost:8000/productsapi/concerts/${id}/update/`, updateData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Concert updated successfully!');
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (error) {
      console.error('❌ Update error:', error.response?.data || error.message);
      setMessage('❌ Failed to update concert.');
    }
  };

  return (
    <div className="concert-update-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="glass-form p-5 w-100" style={{ maxWidth: '600px' }}>
          <h2 className="text-center text-glow mb-4">
            <i className="fas fa-edit me-2"></i> Update Concert
          </h2>

          {message && <div className="alert alert-info text-center">{message}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Concert Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Date and Time</label>
              <input
                type="datetime-local"
                name="date_time"
                className="form-control"
                value={formData.date_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Venue</label>
              <input
                type="text"
                name="venue"
                className="form-control"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Ticket Price</label>
                <input
                  type="number"
                  name="ticket_price"
                  className="form-control"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Available Tickets</label>
                <input
                  type="number"
                  name="available_tickets"
                  className="form-control"
                  value={formData.available_tickets}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Update Image</label>
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-fluid rounded mt-3"
                  style={{ maxHeight: '200px' }}
                />
              )}
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-warning px-4 py-2">
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <button className="btn btn-outline-light" onClick={() => navigate('/ConcertList')}>
              <i className="fa fa-arrow-left"></i> Back to Concert list 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertUpdate;
