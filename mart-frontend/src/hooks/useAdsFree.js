// src/hooks/useAdsFree.js
import { useState, useEffect } from 'react';
import { checkStoreAdsFreeStatus } from '../config/api';

export const useAdsFree = (storeSlug) => {
  const [isAdsFree, setIsAdsFree] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkStoreAdsFreeStatus(storeSlug);
        setIsAdsFree(status);
      } catch (error) {
        console.error('Error checking ads-free status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [storeSlug]);

  return { isAdsFree, isLoading };
};