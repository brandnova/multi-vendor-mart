import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">Your Site Name</span>
          </Link>
          <nav>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link to="/terms" className="mr-4">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;