import React, { useState } from 'react';
import { FaTimes, FaSpinner } from "react-icons/fa";
import { API_URL } from '../../config/api';

const ShoppingCart = ({ isOpen, setIsOpen, cartItems, updateQuantity, removeFromCart, calculateTotal, customerInfo, handleCustomerInfoChange, handleCheckout, styles }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const onCheckout = async () => {
    setIsLoading(true);
    try {
      await handleCheckout();
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold" style={styles.primaryText}>Your Cart</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center mb-4">
                  <img
                    src={`${API_URL}${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold" style={styles.primaryText}>{item.name}</h3>
                    <p className="text-gray-600">₦{item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <p className="text-xl font-bold mb-4" style={styles.primaryText}>
                  Total: ₦{calculateTotal()}
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded mb-2 text-sm"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Your Address"
                    value={customerInfo.address}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded mb-2 text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded mb-2 text-sm"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone Number"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className="w-full p-2 border rounded mb-2 text-sm"
                  />
                </div>
                <button
                  className="w-full text-white py-2 rounded-full transition duration-300 text-sm flex items-center justify-center"
                  style={{
                    ...styles.primary,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                  onClick={onCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;