import React from 'react';
import { API_URL } from '../../config/api';
import { FaTimes } from "react-icons/fa";

const ProductModal = ({ isOpen, onClose, product, addToCart, styles }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={styles.accent}>
        <button
          className="relative rounded-lg p-3 top-3 right-3 text-gray-500 hover:text-gray-700"
          style={styles.primary}
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <img
          src={`${API_URL}${product.image}`}
          alt={product.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
        <h2 className="text-2xl font-bold mb-2" style={styles.text}>{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold px-3 rounded-lg" style={styles.primary}>₦{product.price}</span>
          <span className="text-gray-500">In stock: {product.quantity}</span>
        </div>
        <button
          className="w-full text-white py-2 rounded-full transition duration-300 text-sm font-semibold"
          style={styles.primary}
          onClick={() => {
            addToCart(product);
            onClose();
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductModal;