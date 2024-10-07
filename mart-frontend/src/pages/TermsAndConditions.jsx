import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getSiteSettings } from '../config/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const TermsAndConditions = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
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

      <section className="pt-24 pb-16 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: siteSettings.terms_and_conditions }} />
          </div>
          <ul className="list-disc pl-6 mb-4">
            <li>Email: {siteSettings.contact_email}</li>
            <li>Phone: {siteSettings.contact_phone}</li>
            <li>Address: {siteSettings.address}</li>
          </ul>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default TermsAndConditions;