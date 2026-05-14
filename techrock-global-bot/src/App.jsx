import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/login';
import DashboardHub from './pages/Hub/DashboardHub';
import Chat from './pages/Chat/chat';
import Payment from './pages/Payment/Payment';
import SalesStats from './pages/Sales/SalesStats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dynamic routes - :clientId is required */}
        <Route path="/hub/:clientId" element={<DashboardHub />} />
        <Route path="/chat/:clientId" element={<Chat />} />
        <Route path="/payment/:clientId" element={<Payment />} />
        <Route path="/sales/:clientId" element={<SalesStats />} />

        {/* Redirect if no clientId */}
        <Route path="/hub" element={<Navigate to="/login" />} />
        <Route path="/payment" element={<Navigate to="/login" />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
