import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import VendorDashboard from './pages/VendorDashboard';
import EmailVerificationPage from './pages/EmailVerificationPage';
import StorePage from './pages/PublicStorePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/stores/:slug" element={<StorePage />} />
      </Routes>
    </Router>
  );
};

export default App;