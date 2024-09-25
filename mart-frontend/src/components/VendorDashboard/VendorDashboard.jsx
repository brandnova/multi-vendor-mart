import React, { useState, useEffect } from 'react';
import axios from 'axios';
import withAuth from '../../config/withAuth';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUser } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import Sidebar from './Sidebar';
import DashboardSection from './DashboardSection';
import CreateStoreSection from './CreateStoreSection';
import ManageProductsSection from './ManageProductsSection';
import BankDetailsSection from './BankDetailsSection';
import ManageOrdersSection from './ManageOrdersSection';
import { Button, Alert } from './UIComponents';

const VendorDashboard = ({ user }) => {
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const storeResponse = await axios.get(`${API_URL}/stores/store/detail/`, { headers });
      setStoreData(storeResponse.data);

      if (storeResponse.data) {
        const productsResponse = await axios.get(`${API_URL}/stores/products/`, { headers });
        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);

        const bankDetailsResponse = await axios.get(`${API_URL}/stores/bank-details/list/`, { headers });
        setBankDetails(Array.isArray(bankDetailsResponse.data) ? bankDetailsResponse.data : []);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStoreData(null);
        setActiveSection('create-store');
      } else {
        setError('Failed to fetch store data. Please try again later.');
        console.error('Error fetching data:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateStore = async (storeData) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      let response;

      if (storeData.id) {
        response = await axios.put(`${API_URL}/stores/store/detail/`, storeData, { headers });
        setSuccessMessage('Store updated successfully!');
      } else {
        response = await axios.post(`${API_URL}/stores/store/`, storeData, { headers });
        setSuccessMessage('Store created successfully!');
      }

      setStoreData(response.data);
      setActiveSection('dashboard');
      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to save store. Please try again later.');
        console.error('Error saving store:', err);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Adjust sidebar width based on isSidebarOpen */}
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
                {/* Toggle sidebar visibility */}
                
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeSection === 'dashboard' && 'Dashboard'}
                  {activeSection === 'create-store' && (storeData ? 'Update Store' : 'Create Store')}
                  {activeSection === 'manage-products' && 'Manage Products'}
                  {activeSection === 'bank-details' && 'Bank Details'}
                  {activeSection === 'orders' && 'Orders'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <FaUser className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user.first_name}</span>
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
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
          {error && <Alert type="error" onDismiss={() => setError(null)}>{error}</Alert>}
          {successMessage && <Alert type="success" onDismiss={() => setSuccessMessage(null)}>{successMessage}</Alert>}
          {!storeData && activeSection !== 'create-store' && (
            <Alert type="info">
              You don't have a store yet. Please create one to get started.
              <Button onClick={() => setActiveSection('create-store')} className="ml-4">
                Create Store
              </Button>
            </Alert>
          )}
          <div className="mt-6">
            {storeData && activeSection === 'dashboard' && (
              <DashboardSection
                storeData={storeData}
                products={products}
                bankDetails={bankDetails}
                setActiveSection={setActiveSection}
              />
            )}
            {activeSection === 'create-store' && (
              <CreateStoreSection
                storeData={storeData}
                setStoreData={setStoreData}
                onSubmit={handleCreateOrUpdateStore}
                setActiveSection={setActiveSection}
              />
            )}
            {storeData && activeSection === 'manage-products' && (
              <ManageProductsSection />
            )}
            {storeData && activeSection === 'bank-details' && (
              <BankDetailsSection />
            )}
            {storeData && activeSection === 'orders' && (
              <ManageOrdersSection />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default withAuth(VendorDashboard);
