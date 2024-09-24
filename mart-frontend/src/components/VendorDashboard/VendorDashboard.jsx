import React, { useState, useEffect } from 'react';
import axios from 'axios';
import withAuth from '../../config/withAuth';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { API_URL, logout } from '../../config/api';
import Sidebar from './Sidebar';
import DashboardSection from './DashboardSection';
import CreateStoreSection from './CreateStoreSection';
import ManageProductsSection from './ManageProductsSection';
import BankDetailsSection from './BankDetailsSection';
import ManageOrdersSection from './ManageOrdersSection';
import { Button, Alert } from './UIComponents';

const VendorDashboard = () => {
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(true);
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

  const handleCreateStore = async (newStore) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/stores/store/`, newStore, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStoreData(response.data);
      setActiveSection('dashboard');
      setSuccessMessage('Store created successfully!');
      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to create store. Please try again later.');
        console.error('Error creating store:', err);
      }
    }
  };


  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeItem={activeSection}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header>
          <div className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'create-store' && (storeData ? 'Your Store' : 'Create Store')}
                {activeSection === 'manage-products' && 'Manage Products'}
                {activeSection === 'bank-details' && 'Bank Details'}
                {activeSection === 'orders' && 'Orders'}
              </h1>
              <Button onClick={toggleSidebar} className="bg-gray-700 text-gray-300 hover:bg-gray-700">
                <FaBars />
              </Button>
            </div>
          </div>
          <div className="w-full flex items-center justify-end">
            <Button onClick={logout} className="bg-red-500 text-white p-3 m-3 hover:bg-red-600">
              Logout
            </Button>
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
          {storeData && activeSection === 'dashboard' && (
            <DashboardSection
              storeData={storeData}
              products={products}
              bankDetails={bankDetails}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === 'create-store' && (
            storeData ? (
              <div>
                <p>You already own a store named "{storeData.name}".</p>
                <Button className="mt-4 bg-red-500 text-white">Delete Store</Button>
              </div>
            ) : (
              <CreateStoreSection handleCreateStore={handleCreateStore} />
            )
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
        </main>
      </div>
    </div>
  );
};

export default withAuth(VendorDashboard);