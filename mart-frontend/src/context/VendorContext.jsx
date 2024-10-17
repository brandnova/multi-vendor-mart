// src/context/VendorContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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

  const fetchInitialData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Add these new functions for updating state after CRUD operations
  const updateStore = useCallback(async (data) => {
    try {
      const updatedStore = await api.updateStore(data);
      setStoreData(updatedStore);
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    try {
      const updatedProduct = await api.updateProduct(id, data);
      setProducts(prevProducts => 
        prevProducts.map(product => product.id === id ? updatedProduct : product)
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, []);

  const addProduct = useCallback(async (data) => {
    try {
      const newProduct = await api.createProduct(data);
      setProducts(prevProducts => [...prevProducts, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }, []);

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
    updateStore,
    updateProduct,
    addProduct,
    deleteProduct,
  };

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>;
};