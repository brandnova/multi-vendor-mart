import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import EmailVerificationPage from './pages/EmailVerificationPage';


// Placeholder components for other pages
const StoresPage = () => <div>Browse Stores Page</div>;
const BecomeVendorPage = () => <div>Become a Vendor Page</div>;
const TermsPage = () => <div>Terms and Conditions Page</div>;
const PrivacyPage = () => <div>Privacy Policy Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/become-vendor" element={<BecomeVendorPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

