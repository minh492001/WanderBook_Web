import { StrictMode } from 'react'
import React from 'react'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
// import { Route } from 'lucide-react'
import HomePage from './components/pages/homepage.jsx'
import BookingPage from './components/pages/bookingpage.jsx'
import RoomManagementPage from './components/pages/roommanagerpage.jsx'
import LoginPage from './components/auth/auth-view.jsx'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/rooms" element={<RoomManagementPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
    </Router>
  </React.StrictMode>
)
