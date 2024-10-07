import React, { useState } from 'react';
import { API_URL } from '../../config/api';
import { EnhancedPagination } from '../VendorDashboard/UIComponents';
import ProductModal from './ProductModal';
import ShareModal from './ShareModal';
import { FaShare } from "react-icons/fa";

const ProductList = ({ products, addToCart, currentPage, totalPages, onPageChange, styles, storeSlug }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const openShareModal = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className="py-16" style={styles.secondary}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center" style={styles.text}>Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer"
              style={styles.accent}
              onClick={() => openProductModal(product)}
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
                  <span className="text-2xl font-bold px-3 rounded-lg" style={styles.primary}>₦{product.price}</span>
                  <span className="text-gray-500 text-sm">In stock: {product.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <button
                    className="w-3/4 text-white py-2 rounded-full transition duration-300 text-sm font-semibold mr-2"
                    style={styles.primary}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="flex items-center justify-center w-1/4 text-white py-2 rounded-full transition duration-300 text-sm font-semibold"
                    style={styles.secondary}
                    onClick={(e) => openShareModal(e, product)}
                  >
                    <FaShare className="me-1" />
                    Share
                  </button>
                </div>
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
      {selectedProduct && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={closeProductModal}
          product={selectedProduct}
          addToCart={addToCart}
          styles={styles}
        />
      )}
      {selectedProduct && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          product={selectedProduct}
          storeSlug={storeSlug}
          styles={styles}
        />
      )}
    </section>
  );
};

export default ProductList;