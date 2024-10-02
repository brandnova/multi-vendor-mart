// src/pages/OrderTrackingPage.jsx

import React, { useState, useEffect } from "react";
import { FaSearch, FaCheckCircle, FaShippingFast, FaSpinner, FaTimes } from "react-icons/fa";
import { trackOrder } from "../config/api";
import { useParams } from "react-router-dom";

const OrderTrackingPage = () => {
  const { trackingNumber: initialTrackingNumber } = useParams();
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || "");
  const [orderStatus, setOrderStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTrackingNumber) {
      handleTrackOrder();
    }
  }, [initialTrackingNumber]);

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
    setError("");
  };

  const handleTrackOrder = async () => {
    if (trackingNumber.trim() === "") {
      setError("Please enter a valid tracking number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderData = await trackOrder(trackingNumber);
      setOrderStatus(orderData);
    } catch (err) {
      setError(err.message || "An error occurred while tracking the order");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderStatus) {
      const statusElement = document.getElementById("status-area");
      statusElement.style.animation = "fadeIn 0.5s ease-in-out";
      setTimeout(() => {
        statusElement.style.animation = "";
      }, 500);
    }
  }, [orderStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "payment_confirmed":
      case "payment_not_confirmed":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "shipped":
        return "text-purple-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
      case "payment_confirmed":
      case "payment_not_confirmed":
      case "processing":
        return <FaSpinner className="animate-spin" />;
      case "shipped":
        return <FaShippingFast />;
      case "delivered":
        return <FaCheckCircle />;
      case "cancelled":
        return <FaTimes />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Track Your Order</h1>
        
        <div className="relative">
          <input
            type="text"
            value={trackingNumber}
            onChange={handleInputChange}
            placeholder="Enter your tracking number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            aria-label="Tracking number input"
          />
          <button
            onClick={handleTrackOrder}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
            aria-label="Track order"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
        </div>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        {orderStatus && (
          <div id="status-area" className="mt-8 p-4 bg-gray-100 rounded-md">
            <div className={`flex items-center ${getStatusColor(orderStatus.status)} text-lg font-semibold mb-2`}>
              {getStatusIcon(orderStatus.status)}
              <span className="ml-2 capitalize">{orderStatus.status.replace(/_/g, ' ')}</span>
            </div>
            <p className="text-gray-600">
              Order Number: {orderStatus.id}
            </p>
            <p className="text-gray-600">
              Order Date: {new Date(orderStatus.created_at).toLocaleDateString()}
            </p>
            {orderStatus.status === 'shipped' && (
              <p className="text-gray-600">
                Expected delivery: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Order Details:</h3>
              <ul className="text-sm text-gray-600">
                {orderStatus.items.map((item, index) => (
                  <li key={index}>{item.quantity}x {item.product_name} - ${item.price}</li>
                ))}
              </ul>
            </div>
            <p className="mt-4 font-semibold">Total: ${orderStatus.total_amount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;