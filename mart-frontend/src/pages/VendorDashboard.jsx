// src/pages/VendorDashboardPage.jsx

import React from 'react';
import VendorDashboard from '../components/VendorDashboard/VendorDashboard';
import withAuth from '../config/withAuth';
import { VendorProvider } from '../context/VendorContext';

const VendorDashboardPage = () => {
  return (
    <VendorProvider>
      <VendorDashboard />
    </VendorProvider>
  );
};

export default withAuth(VendorDashboardPage);