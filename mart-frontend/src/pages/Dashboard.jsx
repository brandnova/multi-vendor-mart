import React from 'react';
import { useSelector } from 'react-redux';
import { FaStore, FaBox, FaClipboardList } from 'react-icons/fa';
import StoreCreation from './StoreCreation';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const store = useSelector((state) => state.store.currentStore);

  const DashboardCard = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-2">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard, {user.name}</h1>
      
      {store ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard title="Store Information" icon={<FaStore className="text-blue-500 text-2xl" />}>
            <p><strong>Name:</strong> {store.name}</p>
            <p><strong>Location:</strong> {store.location}</p>
            <p><strong>Email:</strong> {store.contact_email}</p>
            <p><strong>Phone:</strong> {store.contact_phone}</p>
          </DashboardCard>
          
          <DashboardCard title="Product Management" icon={<FaBox className="text-green-500 text-2xl" />}>
            <p>Manage your store's products here.</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
              Add New Product
            </button>
          </DashboardCard>
          
          <DashboardCard title="Order Management" icon={<FaClipboardList className="text-purple-500 text-2xl" />}>
            <p>View and manage your store's orders here.</p>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-200">
              View Orders
            </button>
          </DashboardCard>
        </div>
      ) : (
        <StoreCreation />
      )}
    </div>
  );
};

export default Dashboard;