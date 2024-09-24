import React from 'react';
const SidebarItem = ({ icon, label, active, onClick }) => {
    return (
      <a
        href="#"
        onClick={onClick}
        className={`flex items-center p-2 rounded-md hover:bg-gray-100 ${
          active ? 'bg-gray-100' : ''
        }`}
      >
        <i className={`fas fa-${icon} mr-3`} />
        <span className="font-medium">{label}</span>
      </a>
    );
  };
  
  export { SidebarItem };