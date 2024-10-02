import React from 'react';
import { FaTimes } from "react-icons/fa";

const ContactInfoModal = ({ isOpen, setIsOpen, contactEmail, contactPhone, styles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={styles.text}>Contact Information</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <p><strong>Email:</strong> {contactEmail}</p>
        <p><strong>Phone:</strong> {contactPhone}</p>
      </div>
    </div>
  );
};

export default ContactInfoModal;