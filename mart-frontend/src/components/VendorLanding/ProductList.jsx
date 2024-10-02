// src/components/VendorLanding/ProductList.jsx

import React from 'react';
import { API_URL } from '../../config/api';
import { EnhancedPagination } from '../VendorDashboard/UIComponents';

const ProductList = ({ products, addToCart, currentPage, totalPages, onPageChange, styles }) => {
  return (
    <section className="py-16" style={styles.secondary}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center" style={styles.text}>Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
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
        <EnhancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          styles={styles}
        />
      </div>
    </section>
  );
};

export default ProductList;