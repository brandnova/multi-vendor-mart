// src/pages/StorePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import HeroSection from '../components/StorePage/HeroSection';
import ProductGrid from '../components/StorePage/ProductGrid';
import Cart from '../components/StorePage/Cart';
import InfoModal from '../components/StorePage/InfoModal';
import CheckoutModal from '../components/StorePage/CheckoutModal';

const StorePage = () => {
  const { slug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeResponse = await axios.get(`/api/stores/${slug}`);
        setStoreData(storeResponse.data);
        
        const productsResponse = await axios.get(`/api/stores/${slug}/products`);
        setProducts(productsResponse.data);
      } catch (err) {
        setError('Failed to load store data. Please try again later.');
        console.error('Error fetching store data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [slug]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleCheckout = async (customerData) => {
    try {
      const orderData = {
        storeId: storeData.id,
        items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
        ...customerData
      };
      await axios.post('/api/orders', orderData);
      setCart([]);
      setIsCheckoutModalOpen(false);
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">{storeData.name}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsInfoModalOpen(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FaInfoCircle size={24} />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-gray-600 hover:text-gray-800 relative"
            >
              <FaShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <HeroSection storeData={storeData} />
      <ProductGrid products={products} addToCart={addToCart} />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutModalOpen(true);
        }}
      />

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        storeData={storeData}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        onSubmit={handleCheckout}
      />
    </div>
  );
};

export default StorePage;