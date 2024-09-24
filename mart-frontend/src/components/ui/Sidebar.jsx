import React from 'react';

const Sidebar = ({ children, activeItem }) => {
  return (
    <div className="bg-white shadow-lg flex-shrink-0 w-64 p-6">
      <nav>{children}</nav>
    </div>
  );
};


export { Sidebar };