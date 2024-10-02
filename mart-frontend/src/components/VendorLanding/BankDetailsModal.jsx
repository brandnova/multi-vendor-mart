import React from 'react';
import { FaTimes } from "react-icons/fa";

const BankDetailsModal = ({ isOpen, setIsOpen, bankDetails, styles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={styles.text}>Bank Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        {bankDetails && bankDetails.length > 0 ? (
          bankDetails.map((bank, index) => (
            <div key={index} className="mb-4 p-4 rounded-lg" style={{...styles.border, borderWidth: '1px', borderStyle: 'solid'}}>
              <p><strong>Bank:</strong> {bank.bank_name}</p>
              <p><strong>Account Number:</strong> {bank.account_number}</p>
              <p><strong>Account Name:</strong> {bank.account_name}</p>
            </div>
          ))
        ) : (
          <p>No bank details available.</p>
        )}
      </div>
    </div>
  );
};

export default BankDetailsModal;