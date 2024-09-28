import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import VendorDashboard from './pages/VendorDashboard';
import EmailVerificationPage from './pages/EmailVerificationPage';
import StorePage from './pages/PublicStorePage';
import ColorPaletteGenerator from './pages/ColorPaletteGenerator';
import ProfileUpdatePage from './components/VendorDashboard/ProfileUpdatePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/cpgenerator" element={<ColorPaletteGenerator />} />
        <Route path="/stores/:slug" element={<StorePage />} />
        <Route path="/profile" element={<ProfileUpdatePage />} />
      </Routes>
    </Router>
  );
};

export default App;