// src/page/OnlineStore.jsx

import React, { useState, useEffect } from "react";
import FeaturedProducts from './FeaturedProducts';
import Navbar from '../components/VendorLanding/Navbar';
import HeroSection from '../components/VendorLanding/HeroSection';
import ProductList from '../components/VendorLanding/ProductList';
import ShoppingCart from '../components/VendorLanding/ShoppingCart';
import BankDetailsModal from '../components/VendorLanding/BankDetailsModal';
import ContactInfoModal from '../components/VendorLanding/ContactInfoModal';
import SaveInfoModal from '../components/VendorLanding/SaveInfoModal';
import OptionsModal from '../components/VendorLanding/OptionsModal';
import { createOrder } from '../config/api';

const OnlineStore = ({ storeData }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState(false);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });
  const [showSaveInfoModal, setShowSaveInfoModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [filteredProducts, setFilteredProducts] = useState(storeData.products);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const filtered = storeData.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesPrice;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, priceRange, storeData.products]);

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
    localStorage.removeItem('currentOrder');
  };

  useEffect(() => {
    const savedInfo = localStorage.getItem('customerInfo');
    if (savedInfo) {
      setCustomerInfo(JSON.parse(savedInfo));
    }

    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setCurrentOrder(JSON.parse(savedOrder));
    }
    return () => {
      clearCurrentOrder();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    }
  }, [currentOrder]);

  
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

      const response = await createOrder(storeData.slug, orderData);
      console.log('Order created:', response);
      setCurrentOrder(response);
      setCartItems([]);
      setIsCartOpen(false);
      setShowSaveInfoModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleStartNewOrder = () => {
    clearCurrentOrder();
    setCartItems([]);
    setIsCartOpen(false);
    setIsOptionsOpen(false);
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = (save) => {
    if (save) {
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    }
    setShowSaveInfoModal(false);
    setIsOptionsOpen(true);
  };

  const styles = {
    primary: { backgroundColor: storeData.primary_color, color: '#ffffff' },
    secondary: { backgroundColor: storeData.secondary_color, color: storeData.primary_color },
    accent: { backgroundColor: storeData.accent_color },
    border: { borderColor: storeData.accent_color },
    text: { color: storeData.primary_color },
    background: { backgroundColor: '#f8f9fa' },
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange({ min, max: max || Infinity });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="font-sans" style={styles.secondary}>
      <Navbar
        storeName={storeData.name}
        cartItemsCount={cartItems.length}
        setIsCartOpen={setIsCartOpen}
        setIsBankDetailsOpen={setIsBankDetailsOpen}
        setIsContactInfoOpen={setIsContactInfoOpen}
        setIsOptionsOpen={setIsOptionsOpen}
        handleSearch={handleSearch}
        handlePriceRangeChange={handlePriceRangeChange}
        styles={styles}
      />

      <HeroSection storeData={storeData} />

      <FeaturedProducts products={storeData.products} styles={styles} />

      <ProductList
        products={paginatedProducts}
        addToCart={addToCart}
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
        onPageChange={handlePageChange}
        styles={styles}
      />

      <ShoppingCart
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        customerInfo={customerInfo}
        handleCustomerInfoChange={handleCustomerInfoChange}
        handleCheckout={handleCheckout}
        styles={styles}
      />

      <BankDetailsModal
        isOpen={isBankDetailsOpen}
        setIsOpen={setIsBankDetailsOpen}
        bankDetails={storeData.bank_details}
        styles={styles}
      />

      <ContactInfoModal
        isOpen={isContactInfoOpen}
        setIsOpen={setIsContactInfoOpen}
        contactEmail={storeData.contact_email}
        contactPhone={storeData.contact_phone}
        styles={styles}
      />

      <SaveInfoModal
        isOpen={showSaveInfoModal}
        handleSaveInfo={handleSaveInfo}
        styles={styles}
      />

      <OptionsModal
        isOpen={isOptionsOpen}
        setIsOpen={setIsOptionsOpen}
        currentOrder={currentOrder}
        styles={styles}
        onStartNewOrder={handleStartNewOrder}
      />
    </div>
  );
};

export default OnlineStore;