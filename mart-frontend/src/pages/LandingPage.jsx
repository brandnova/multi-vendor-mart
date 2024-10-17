// src/pages/LandingPage.jsx

import React, { useState, useEffect } from "react";
import { FaStore, FaShoppingCart, FaChartLine, FaLock, FaRegLightbulb, FaUserFriends } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { getSiteSettings, getRecentStores } from '../config/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RecentStores from '../components/RecentStores';

const LandingPage = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [recentStores, setRecentStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, stores] = await Promise.all([
          getSiteSettings(),
          getRecentStores(6)
        ]);
        setSiteSettings(settings);
        setRecentStores(stores);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load page data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-t-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <Navbar siteSettings={siteSettings} />

      {/* Hero Section */}
      <section className="h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white pt-52 pb-16 relative overflow-hidden">
        <div className="container my-auto mx-auto text-center px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Empower Your Business with {siteSettings.site_name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8"
          >
            {siteSettings.tagline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center flex-col md:flex-row md:space-x-4"
          >
            <Link to="/auth" className="bg-yellow-400 text-indigo-900 font-bold py-3 px-8 my-2 rounded-full hover:bg-yellow-300 transition duration-300">
              Get Started Now
            </Link>
            <Link to="/terms-and-conditions" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 my-2 rounded-full hover:bg-white hover:text-indigo-900 transition duration-300">
              Read Terms and Conditions
            </Link>
          </motion.div>
        </div>
        <div className="absolute inset-0 z-0 opacity-20">
          <motion.img
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Why Choose {siteSettings.site_name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaStore, title: "Low Fees", description: "Enjoy competitive rates that maximize your profits", color: "bg-green-500" },
              { icon: IoMdCheckmarkCircleOutline, title: "Easy Setup", description: "Get your store up and running in minutes, not days", color: "bg-blue-500" },
              { icon: FaChartLine, title: "Growth Tools", description: "Access powerful analytics to scale your business", color: "bg-purple-500" },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`${benefit.color} text-white rounded-full p-4 inline-block mb-4`}>
                  <benefit.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Powerful Features for Your Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaStore, title: "Custom Store Creation", description: "Design your unique storefront with our intuitive tools", color: "text-blue-500" },
              { icon: FaShoppingCart, title: "Order Tracking", description: "Real-time updates on all your orders in one place", color: "text-green-500" },
              { icon: FaChartLine, title: "Analytics Dashboard", description: "Gain insights with comprehensive sales and traffic data", color: "text-purple-500" },
              { icon: FaLock, title: "Secure Transactions", description: "Bank transfer system for safe and easy payments", color: "text-red-500" },
              { icon: FaRegLightbulb, title: "Product Management", description: "Effortlessly manage your product catalog", color: "text-yellow-500" },
              { icon: FaUserFriends, title: "Customer Management", description: "Build and maintain customer relationships", color: "text-indigo-500" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                <feature.icon className={`${feature.color} mb-4`} size={32} />
                <h3 className="text-xl font-semibold mb-2 text-indigo-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-indigo-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            {[
              { step: 1, title: "Sign Up", description: "Create your free account in minutes" },
              { step: 2, title: "Set Up Your Store", description: "Customize your store profile and add products" },
              { step: 3, title: "Receive Orders", description: "Customers place orders through your custom URL" },
              { step: 4, title: "Process Payments", description: "Receive payments via bank transfer" },
              { step: 5, title: "Fulfill Orders", description: "Ship products to your customers" },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center mb-8"
              >
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-indigo-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">What Our Vendors Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "John Doe", business: "Artisan Crafts", quote: "Thanks to this platform, I've been able to reach customers I never thought possible!" },
              { name: "Jane Smith", business: "Organic Foods", quote: "The simplicity of the setup process allowed me to focus on what I do best - creating great products." },
              { name: "Mike Johnson", business: "Vintage Collectibles", quote: "The analytics tools have been a game-changer for understanding my customer base." },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-indigo-50 p-6 rounded-lg shadow-md"
              >
                <p className="italic mb-4 text-gray-700">"{testimonial.quote}"</p>
                <p className="font-semibold text-indigo-900">{testimonial.name}</p>
                <p className="text-sm text-indigo-600">{testimonial.business}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Stores Section */}
      <section id="recent-stores" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-indigo-900">Join Our Growing Community of Vendors</h2>
          <RecentStores stores={recentStores} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Join thousands of vendors who have found success with {siteSettings.site_name}</p>
          <Link to="/auth" className="bg-yellow-400 text-indigo-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300">
            Create Your Store Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default LandingPage;