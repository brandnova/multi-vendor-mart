import React from 'react';
import { FaHome, FaPlus, FaBox, FaDollarSign, FaExchangeAlt } from 'react-icons/fa';

const Sidebar = ({ activeItem, isCollapsed, toggleSidebar, setActiveSection }) => {
  const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
      className={`px-4 py-3 rounded-md cursor-pointer ${
        active
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon />
        {!isCollapsed && <span className="ml-3">{label}</span>}
      </div>
    </div>
  );

  return (
    <div className={`bg-gray-800 h-screen ${isCollapsed ? 'w-15' : 'w-64'} transition-all duration-300 overflow-y-auto`}>
      <div className="flex flex-col h-full">
        <SidebarItem
          icon={FaHome}
          label="Dashboard"
          active={activeItem === 'dashboard'}
          onClick={() => setActiveSection('dashboard')}
        />
        <SidebarItem
          icon={FaPlus}
          label="Create Store"
          active={activeItem === 'create-store'}
          onClick={() => setActiveSection('create-store')}
        />
        <SidebarItem
          icon={FaBox}
          label="Manage Products"
          active={activeItem === 'manage-products'}
          onClick={() => setActiveSection('manage-products')}
        />
        <SidebarItem
          icon={FaDollarSign}
          label="Bank Details"
          active={activeItem === 'bank-details'}
          onClick={() => setActiveSection('bank-details')}
        />
        <SidebarItem
          icon={FaExchangeAlt}
          label="Orders"
          active={activeItem === 'orders'}
          onClick={() => setActiveSection('orders')}
        />
      </div>
    </div>
  );
};

export default Sidebar;