// CardHeader.js
import React from 'react';

const CardHeader = ({ children }) => {
  return (
    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
      {children}
    </div>
  );
};

export default CardHeader;