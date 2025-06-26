import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../style/CreateConcert.css'; 

const CreateConcert = () => {
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    for (let key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:8000/productsapi/concerts/create/', submitData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('🎉 Concert created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    } catch (error) {
      setMessage('❌ Error creating concert.');
      console.error('Create Concert Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="concert-bg">
      <div className="glass-card p-4">
        <h2 className="text-dark mb-4 text-center">
          <i className="fas fa-music"></i> Create a New Concert
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white">Concert Name</label>
            <input type="text" name="name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Date and Time</label>
            <input type="datetime-local" name="date_time" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Venue</label>
            <input type="text" name="venue" className="form-control" onChange={handleChange} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-white">Ticket Price</label>
              <input type="number" name="ticket_price" className="form-control" onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-white">Available Tickets</label>
              <input type="number" name="available_tickets" className="form-control" onChange={handleChange} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label text-white">Concert Image</label>
            <input type="file" name="image" className="form-control" accept="image/*" onChange={handleChange} />
            {preview && (
              <img src={preview} alt="Preview" className="mt-3 img-fluid rounded" style={{ maxHeight: '200px' }} />
            )}
          </div>
          <div className="text-center mt-4">
            <button type="submit" className="btn btn-success px-4 py-2 shadow-sm">
              <i className="fa-solid fa-circle-check"></i> Create Concert
            </button>
          </div>
        </form>

        {message && <div className="alert alert-info mt-4">{message}</div>}

        <div className="text-center mt-4">
          <Link to="/ConcertList" className="btn btn-outline-light">
            <i className="fa fa-arrow-left"></i> Back to Concert list
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateConcert;
