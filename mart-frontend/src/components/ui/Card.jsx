// Card.js
import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      {children}
    </div>
  );
};


export { Card };