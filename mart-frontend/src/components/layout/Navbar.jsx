import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const useScrollToSection = () => {
  const location = useLocation();

  const scrollTo = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on homepage, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };

  return scrollTo;
};

const Navbar = ({ siteSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollTo = useScrollToSection();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-indigo-900 text-white p-4 fixed w-full z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">{siteSettings.site_name}</Link>
        <div className="hidden md:flex space-x-4">
          <button onClick={() => scrollTo('benefits')} className="hover:text-indigo-300 transition duration-300">Benefits</button>
          <button onClick={() => scrollTo('features')} className="hover:text-indigo-300 transition duration-300">Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-indigo-300 transition duration-300">How It Works</button>
          <button onClick={() => scrollTo('testimonials')} className="hover:text-indigo-300 transition duration-300">Testimonials</button>
          <button onClick={() => scrollTo('recent-stores')} className="hover:text-indigo-300 transition duration-300">Our Vendors</button>
        </div>
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-indigo-800 mt-2 p-4"
        >
          <button onClick={() => scrollTo('benefits')} className="block py-2 hover:text-indigo-300">Benefits</button>
          <button onClick={() => scrollTo('features')} className="block py-2 hover:text-indigo-300">Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="block py-2 hover:text-indigo-300">How It Works</button>
          <button onClick={() => scrollTo('testimonials')} className="block py-2 hover:text-indigo-300">Testimonials</button>
          <button onClick={() => scrollTo('recent-stores')} className="block py-2 hover:text-indigo-300">Our Vendors</button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;