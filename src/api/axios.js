// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Use your backend API URL here
  headers: {
    'Content-Type': 'application/json',  // Setting default headers
  },
});

export default instance;
