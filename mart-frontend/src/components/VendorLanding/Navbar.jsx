import React, { useState, useRef, useEffect } from 'react';
import { FaShoppingCart, FaInfoCircle, FaAddressCard, FaUpload, FaSearch, FaTimes, FaBars } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ 
  storeName, 
  cartItemsCount, 
  setIsCartOpen, 
  setIsBankDetailsOpen, 
  setIsContactInfoOpen, 
  setIsOptionsOpen, 
  handleSearch,
  handlePriceRangeChange,
  styles 
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
    handlePriceRangeChange(Number(minPrice) || 0, Number(maxPrice) || Infinity);
    setIsSearchOpen(false);
  };

  const NavButton = ({ onClick, icon, badge, label, showLabel = true }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full hover:bg-opacity-80 transition duration-300 relative flex items-center"
      onClick={onClick}
      style={styles.primary}
    >
      {showLabel && label && <span className="mr-2">{label}</span>}
      {icon}
      {badge}
    </motion.button>
  );

  const navItems = [
    { icon: <FaInfoCircle className="text-xl" />, onClick: () => setIsBankDetailsOpen(true), label: "Bank Details" },
    { icon: <FaAddressCard className="text-xl" />, onClick: () => setIsContactInfoOpen(true), label: "Contact Info" },
    { icon: <FaUpload className="text-xl" />, onClick: () => setIsOptionsOpen(true), label: "Options" },
    { 
      icon: <FaShoppingCart className="text-xl -me-2" />, 
      onClick: () => setIsCartOpen(true),
      label: "Cart",
      badge: cartItemsCount > 0 && (
        <span className="relative -top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartItemsCount}
        </span>
      )
    },
  ];

  return (
    <nav className="p-4 sticky top-0 z-10" style={styles.primary}>
      <div className="container mx-auto flex justify-between items-center">
      <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {storeName}
        </motion.h1>
        <div className="flex items-center">
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <NavButton 
              icon={<FaSearch className="text-xl" />}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              label="Search"
              showLabel={false}
            />
            {navItems.map((item, index) => (
              <NavButton key={index} {...item} showLabel={false} />
            ))}
          </motion.div>
          <div className="flex md:hidden items-center space-x-2">
            <NavButton 
              icon={<FaSearch className="text-xl" />}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              label="Search"
              showLabel={false}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-opacity-80 transition duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.primary}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </motion.div>
            </motion.button>
          </div>
          <div className="relative" ref={searchRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-10 w-72 bg-white rounded-lg shadow-lg p-4"
                  style={styles.accent}
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-2 rounded border"
                    style={{ borderColor: styles.primary.backgroundColor, color: styles.text.color }}
                  />
                    <h2 className="my-2 font-semibold text-center" style={styles.text}>Filter By Price Range</h2>
                    <div className="flex space-x-2 mb-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-1/2 p-2 rounded border"
                      style={{ borderColor: styles.primary.backgroundColor, color: styles.text.color }}
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-1/2 p-2 rounded border"
                      style={{ borderColor: styles.primary.backgroundColor, color: styles.text.color }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full p-2 rounded text-white font-semibold hover:bg-opacity-80 transition duration-300"
                    style={styles.primary}
                  >
                    Search
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 space-y-2 overflow-hidden"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-end"
              >
                <button
                  className="p-2 rounded flex items-center hover:bg-opacity-80 transition duration-300"
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  style={styles.primary}
                >
                  <span className="mr-2">{item.label}</span>
                  {item.icon}
                  {item.badge}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;