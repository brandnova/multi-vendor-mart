import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaInfoCircle, FaTimes, FaAddressCard } from "react-icons/fa";
import FeaturedProducts from './FeaturedProducts';
import axios from 'axios';
import { API_URL } from '../config/api';

const OnlineStore = ({ storeData }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });
  const [showSaveInfoModal, setShowSaveInfoModal] = useState(false);

  useEffect(() => {
    const savedInfo = localStorage.getItem('customerInfo');
    if (savedInfo) {
      setCustomerInfo(JSON.parse(savedInfo));
    }
  }, []);

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
      setShowSaveInfoModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = (save) => {
    if (save) {
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    }
    setShowSaveInfoModal(false);
    alert('Order placed successfully!');
  };

  const styles = {
    primary: { backgroundColor: storeData.primary_color, color: '#ffffff' },
    secondary: { backgroundColor: storeData.secondary_color, color: storeData.primary_color },
    accent: { backgroundColor: storeData.accent_color },
    border: { borderColor: storeData.accent_color },
    text: { color: storeData.primary_color },
    background: { backgroundColor: '#f8f9fa' },
  };

  return (
    <div className="font-sans" style={styles.secondary}>
      {/* Navbar */}
      <nav className="p-4 sticky top-0 z-10" style={styles.primary}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{storeData.name}</h1>
          <div className="flex items-center space-x-6">
            <button
              className="hover:opacity-75 transition duration-300"
              onClick={() => setIsBankDetailsOpen(true)}
            >
              <FaInfoCircle className="text-xl" />
            </button>
            <button
              className="hover:opacity-75 transition duration-300"
              onClick={() => setIsContactInfoOpen(true)}
            >
              <FaAddressCard className="text-xl" />
            </button>
            <button
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <FaShoppingCart className="text-2xl hover:opacity-75 transition duration-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" style={styles.secondary}>
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 text-white">
        <img
          src={storeData.banner_image}
          alt={`${storeData.name} banner`}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-bold mb-1 text-center">{storeData.name}</h2>
          <p className="text-sm mb-6 text-center">{storeData.location}</p>
          {storeData.tag_line && (
            <p className="text-xl italic text-center bg-black bg-opacity-50 px-6 py-2 rounded-full">
              "{storeData.tag_line}"
            </p>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts products={storeData.products} styles={styles} />

      {/* Product List */}
      <section className="py-16" style={styles.secondary}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center" style={styles.text}>Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeData.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                style={styles.accent}
              >
                <img
                  src={`${API_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={styles.text}>{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold px-3 rounded-lg" style={styles.primary}>${product.price}</span>
                    <span className="text-gray-500 text-sm">In stock: {product.quantity}</span>
                  </div>
                  <button
                    className="w-full text-white py-2 rounded-full transition duration-300 text-sm font-semibold"
                    style={styles.primary}
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
                <h2 className="text-xl font-bold" style={styles.primaryText}>Your Cart</h2>
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
                        src={`${API_URL}${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold" style={styles.primaryText}>{item.name}</h3>
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
                    <p className="text-xl font-bold mb-4" style={styles.primaryText}>
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
                      className="w-full text-white py-2 rounded-full transition duration-300 text-sm"
                      style={styles.primary}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={styles.text}>Bank Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsBankDetailsOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            {storeData.bank_details && storeData.bank_details.length > 0 ? (
              storeData.bank_details.map((bank, index) => (
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
      )}

      {/* Contact Info Modal */}
      {isContactInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={styles.text}>Contact Information</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsContactInfoOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <p><strong>Email:</strong> {storeData.contact_email}</p>
            <p><strong>Phone:</strong> {storeData.contact_phone}</p>
          </div>
        </div>
      )}

      {/* Save Info Modal */}
      {showSaveInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md" style={styles.accent}>
            <h2 className="text-xl font-bold mb-4">Save Your Information?</h2>
            <p className="mb-4">Would you like to save your checkout information for future orders?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => handleSaveInfo(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 text-white rounded"
                style={styles.primary}
                onClick={() => handleSaveInfo(true)}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineStore;