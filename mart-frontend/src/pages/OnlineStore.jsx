import React, { useState } from "react";
import { FaShoppingCart, FaInfoCircle, FaTimes } from "react-icons/fa";
import axios from 'axios';
import { API_URL } from '../config/api';

const OnlineStore = ({ storeData }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        store: storeData.id,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await axios.post(`${API_URL}/orders/create/${storeData.slug}/`, orderData);
      console.log('Order created:', response.data);
      setCartItems([]);
      setIsCartOpen(false);
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-3 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{storeData.name}</h1>
          <div className="flex items-center space-x-4">
            <button
              className="text-white hover:text-gray-200"
              onClick={() => setIsBankDetailsOpen(true)}
            >
              <FaInfoCircle className="text-xl" />
            </button>
            <button
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-64 md:h-96 bg-gray-100">
        <img
          src={`${API_URL}/${storeData.banner_image}` || "https://via.placeholder.com/1200x400"}
          alt={`${storeData.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{storeData.name}</h2>
            <p className="text-lg md:text-xl mb-2">{storeData.location}</p>
            <div className="flex justify-center space-x-4 text-sm md:text-base">
              <p><strong>Email:</strong> {storeData.contact_email}</p>
              <p><strong>Phone:</strong> {storeData.contact_phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeData.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold">${product.price}</span>
                    <span className="text-gray-500 text-sm">In stock: {product.quantity}</span>
                  </div>
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition duration-300 text-sm"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-lg overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsCartOpen(false)}
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
                        src={item.image || "https://via.placeholder.com/50"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">${item.price}</p>
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
                    <p className="text-xl font-bold mb-4">
                      Total: ${calculateTotal()}
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
                      className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition duration-300 text-sm"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank Details Modal */}
      {isBankDetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bank Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsBankDetailsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            {storeData.bank_details.length > 0 ? (
              storeData.bank_details.map((bank, index) => (
                <div key={index} className="mb-4">
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
      )}
    </div>
  );
};

export default OnlineStore;