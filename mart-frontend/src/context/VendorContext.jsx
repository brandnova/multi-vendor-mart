// src/context/VendorContext

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../config/api';

const VendorContext = createContext();

export const useVendor = () => useContext(VendorContext);

export const VendorProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const profile = await api.getProfile();
      setUser(profile);

      try {
        const store = await api.getStoreDetails();
        setStoreData(store);

        const [productList, bankDetailsList, orderList] = await Promise.all([
          api.getProducts(),
          api.getBankDetails(),
          api.getOrders(),
        ]);
        setProducts(productList);
        setBankDetails(bankDetailsList);
        setOrders(orderList);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Store doesn't exist yet, set other data to empty arrays
          setStoreData(null);
          setProducts([]);
          setBankDetails([]);
          setOrders([]);
        } else {
          throw err;
        }
      }
    } catch (err) {
      setError('Failed to fetch initial data. Please try again.');
      console.error('Error fetching initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    storeData,
    setStoreData,
    products,
    setProducts,
    bankDetails,
    setBankDetails,
    orders,
    setOrders,
    isLoading,
    error,
    fetchInitialData,
  };

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};