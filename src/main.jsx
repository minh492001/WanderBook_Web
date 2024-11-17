import { StrictMode } from 'react'
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
// import { Route } from 'lucide-react'
import HomePage from './components/pages/homepage.jsx';
import BookingPage from './components/pages/bookingpage.jsx';
import LoginPage from './components/auth/login-page.jsx';
import RegisterPage from './components/auth/register-page.jsx';
import UserProfile from './components/user-pages/profile-page.jsx';
import EditProfile from './components/user-pages/edit-profile-page.jsx';
import DashboardPage from './components/admin-pages/dashboard-page.jsx';
import Accommodations from './components/pages/roompage.jsx';
import AmenitiesAndServices from './components/pages/services-page.jsx';
import DiningExperiences from './components/pages/restaurant-page.jsx';
import ChangePasswordPage from './components/auth/change-password-page.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/rooms" element={<Accommodations />} />
          <Route path='/amenities-and-services' element={<AmenitiesAndServices />} />
          <Route path='/restaurant' element={<DiningExperiences />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />
        </Routes>
    </Router>
  </React.StrictMode>
)
