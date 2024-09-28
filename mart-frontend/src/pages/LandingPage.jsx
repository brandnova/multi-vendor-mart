// src/pages/LandingPage.jsx

import React, { useState, useEffect } from "react";
import { FaBars, FaTimes, FaStore, FaShoppingCart, FaChartLine, FaLock } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { getSiteSettings } from '../config/api';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!siteSettings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 fixed w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">{siteSettings.site_name}</Link>
          <div className="hidden md:flex space-x-4">
            <a href="#benefits" className="hover:text-blue-200">Benefits</a>
            <a href="#features" className="hover:text-blue-200">Features</a>
            <a href="#get-started" className="hover:text-blue-200">Get Started</a>
            {/* <a href="#testimonials" className="hover:text-blue-200">Testimonials</a> */}
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-blue-500 mt-2 p-4">
            <a href="#benefits" className="block py-2">Benefits</a>
            <a href="#features" className="block py-2">Features</a>
            <a href="#get-started" className="block py-2">Get Started</a>
            {/* <a href="#testimonials" className="block py-2">Testimonials</a> */}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white pt-24 pb-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Empower Your Business with {siteSettings.site_name}</h1>
          <p className="text-xl mb-8">{siteSettings.tagline}</p>
          <Link to="/auth" className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300">Get Started Now</Link>
        </div>
        <div className="mt-12 flex justify-center">
          <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df" alt={siteSettings.site_name} className="rounded-lg shadow-2xl max-w-full h-auto" />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose {siteSettings.site_name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full p-4 inline-block mb-4">
                <FaStore size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
              <p>Enjoy competitive rates that maximize your profits</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full p-4 inline-block mb-4">
                <IoMdCheckmarkCircleOutline size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Setup</h3>
              <p>Get your store up and running in minutes, not days</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full p-4 inline-block mb-4">
                <FaChartLine size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Tools</h3>
              <p>Access powerful analytics to scale your business</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Your Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <FaStore className="text-blue-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Custom Store Creation</h3>
              <p>Design your unique storefront with our intuitive tools</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <FaShoppingCart className="text-green-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
              <p>Real-time updates on all your orders in one place</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <FaChartLine className="text-purple-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p>Gain insights with comprehensive sales and traffic data</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <FaLock className="text-red-500 mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p>Multiple payment options with top-notch security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started in 3 Easy Steps</h2>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">1</div>
              <p className="text-lg">Sign up for a free account</p>
            </div>
            <div className="flex items-center mb-8">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">2</div>
              <p className="text-lg">Customize your store profile</p>
            </div>
            <div className="flex items-center mb-12">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">3</div>
              <p className="text-lg">Add your products and start selling</p>
            </div>
            <form className="bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                <input type="email" id="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                <input type="password" id="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300">Create Your Account</button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">{siteSettings.site_name}</h3>
              <p>{siteSettings.tagline}</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
              <p>Email: {siteSettings.contact_email}</p>
              <p>Phone: {siteSettings.contact_phone}</p>
              <p>{siteSettings.address}</p>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                {siteSettings.social_links.map((link, index) => (
                  <a key={index} href={link.url} className="hover:text-blue-400">
                    <FaStore size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 {siteSettings.site_name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;