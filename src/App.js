import React from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation hook
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserConcerts from './pages/UserConcerts';
import CreateConcert from './pages/CreateConcert';
import ConcertList from './pages/ConcertList';
import ConcertDetail from './pages/ConcertDetail';
import ConcertUpdate from './pages/ConcertUpdate';
import ConcertDelete from './pages/ConcertDelete';
import BookTicket from './pages/BookTicket';
import CancelTicket from './pages/CancelTicket';
import BookingDetail from './pages/BookingDetail';
import MyBookings from './pages/MyBookings';
import BookingSummary from './pages/BookingSummary';
import Navbar from './pages/Navbar';
import UserBookingSummary from './pages/UserBookingSummary';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated
  const isAdmin = localStorage.getItem('is_superuser') === 'true'; // Check if user is an admin

  const location = useLocation(); // Use useLocation hook to get current pathname

  // Hide navbar on home, login, register
  const hideNavbarPaths = ['/', '/login', '/register'];

  // Check if the current path is not in the hideNavbarPaths array
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div>
      {/* Show Navbar only if authenticated and NOT an admin, and shouldShowNavbar is true */}
      {isAuthenticated && !isAdmin && shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/userconcerts" element={<UserConcerts />} />
        <Route path="/userbookingsummary" element={<UserBookingSummary />} />
        <Route path="/createconcert" element={<CreateConcert />} />
        <Route path="/concertlist" element={<ConcertList />} />
        <Route path="/concerts/:id" element={<ConcertDetail />} />
        <Route path="/concerts/:id/update" element={<ConcertUpdate />} />
        <Route path="/concerts/:id/delete" element={<ConcertDelete />} />
        <Route path="/book-ticket/:id" element={<BookTicket />} />
        <Route path="/cancel-ticket/:ticketId" element={<CancelTicket />} />
        <Route path="/book-detail/:ticketId" element={<BookingDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
      </Routes>
    </div>
  );
}

export default App;
