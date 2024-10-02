import React, { useState } from 'react';
import { FaTimes, FaUpload, FaSearch, FaExclamationCircle } from "react-icons/fa";
import { uploadPaymentProof } from '../../config/api';

const OptionsModal = ({ isOpen, setIsOpen, currentOrder, styles }) => {
  const [uploadTrackingNumber, setUploadTrackingNumber] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [uploadError, setUploadError] = useState("");

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError("");
  };

  const handlePaymentProofUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first.');
      return;
    }

    const trackingNumberToUse = currentOrder ? currentOrder.tracking_number : uploadTrackingNumber;

    if (!trackingNumberToUse) {
      setUploadError('Please enter a tracking number first.');
      return;
    }

    if (currentOrder && currentOrder.payment_proof) {
      setUploadError('A payment proof already exists for this order.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('payment_proof', selectedFile);

      await uploadPaymentProof(trackingNumberToUse, formData);

      alert('Payment proof uploaded successfully!');
      setSelectedFile(null);
      setUploadTrackingNumber("");
      setUploadError("");
      
      // You might want to update the currentOrder state here if it exists
      // This depends on how you're managing state in your parent component
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      if (error.exists) {
        setUploadError('A payment proof already exists for this order.');
      } else {
        setUploadError('Failed to upload payment proof. Please try again.');
      }
    }
  };

  const handleTrackOrder = () => {
    if (trackingNumber) {
      window.location.href = `/track-order/${trackingNumber}`;
    } else {
      alert('Please enter a tracking number.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={styles.text}>Order Options</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Upload Payment Proof</h3>
            {!currentOrder && (
              <input
                type="text"
                placeholder="Enter order tracking number"
                value={uploadTrackingNumber}
                onChange={(e) => setUploadTrackingNumber(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
            )}
            {currentOrder && !currentOrder.payment_proof && (
              <p className="text-yellow-600 mb-2 flex items-center">
                <FaExclamationCircle className="mr-2" />
                No payment proof uploaded yet.
              </p>
            )}
            {currentOrder && currentOrder.payment_proof && (
              <p className="text-green-600 mb-2">Payment proof already uploaded.</p>
            )}
            <label style={styles.text}>Select Image or PDF</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="w-full my-2"
              disabled={!!(currentOrder && currentOrder.payment_proof)}
            />
            <button
              onClick={handlePaymentProofUpload}
              className="flex items-center justify-center w-full px-4 py-2 text-white rounded"
              disabled={!selectedFile || (currentOrder && currentOrder.payment_proof)}
              style={styles.primary}
            >
              <FaUpload className="mr-2" />
              {currentOrder && currentOrder.payment_proof ? 'Payment Proof Exists' : 'Upload Payment Proof'}
            </button>
            {uploadError && (
              <p className="text-red-500 mt-2">{uploadError}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Track Order</h3>
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleTrackOrder}
              className="flex items-center justify-center w-full px-4 py-2 text-white rounded"
              style={styles.primary}
            >
              <FaSearch className="mr-2" />
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;
