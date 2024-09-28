// src/components/VendorDashboard/VendorDashboard.jsx

import React, { useState } from 'react';
import { useVendor } from '../../context/VendorContext';
import { FaBars, FaUser } from 'react-icons/fa';
import Sidebar from './Sidebar';
import DashboardSection from './DashboardSection';
import CreateStoreSection from './CreateStoreSection';
import ManageProductsSection from './ManageProductsSection';
import BankDetailsSection from './BankDetailsSection';
import ManageOrdersSection from './ManageOrdersSection';
import ProfileUpdatePage from './ProfileUpdatePage';
import { Button, Alert } from './UIComponents';

const VendorDashboard = () => {
  const { user, storeData, isLoading, error } = useVendor();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    if (!storeData && activeSection !== 'create-store') {
      return (
        <div className="text-center mt-8">
          <Alert type="info">
            You don't have a store yet. Please create one to get started.
          </Alert>
          <Button onClick={() => setActiveSection('create-store')} className="mt-4">
            Create Store
          </Button>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'create-store':
        return <CreateStoreSection />;
      case 'manage-products':
        return storeData ? <ManageProductsSection /> : null;
      case 'bank-details':
        return storeData ? <BankDetailsSection /> : null;
      case 'orders':
        return storeData ? <ManageOrdersSection /> : null;
      case 'profile':
        return <ProfileUpdatePage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`md:block ${isSidebarOpen ? 'block' : 'hidden'} md:w-auto transition-all duration-300`}>
        <Sidebar
          activeItem={activeSection}
          isOpen={isSidebarOpen}
          setActiveSection={setActiveSection}
        />
      </div>
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeSection === 'dashboard' && 'Dashboard'}
                  {activeSection === 'create-store' && (storeData ? 'Update Store' : 'Create Store')}
                  {activeSection === 'manage-products' && 'Manage Products'}
                  {activeSection === 'bank-details' && 'Bank Details'}
                  {activeSection === 'orders' && 'Orders'}
                  {activeSection === 'profile' && 'Profile'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                  <span className="text-sm font-medium text-gray-700">{user.last_name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <Button onClick={toggleSidebar} className="mr-4 bg-gray-200 text-gray-600 hover:bg-gray-300">
                  <FaBars />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {error && <Alert type="error">{error}</Alert>}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;