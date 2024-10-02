import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { motion } from "framer-motion";
import OnlineStore from './OnlineStore';

export default function PublicStorePage() {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`${API_URL}/stores/${slug}/`);
        setStoreData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Failed to load store data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [slug]);

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
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return storeData ? (
    <OnlineStore storeData={storeData} />
  ) : (
    <div className="text-center py-10">Store not found.</div>
  );
}