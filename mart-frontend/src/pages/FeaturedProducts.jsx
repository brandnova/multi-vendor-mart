import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const FeaturedProducts = ({ products, styles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState([]);

  useEffect(() => {
    const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
    setVisibleProducts(randomProducts);
  }, [products]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % visibleProducts.length);
  }, [visibleProducts]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + visibleProducts.length) % visibleProducts.length);
  }, [visibleProducts]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (visibleProducts.length === 0) return null;

  return (
    <section className="py-16" style={styles.secondary}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center" style={styles.text}>
          Featured Products
        </h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${visibleProducts.length * 100}%`,
            }}
          >
            {visibleProducts.map((product) => (
              <div key={product.id} className="w-full flex-shrink-0 px-4">
                <div className="rounded-lg shadow-lg p-6 h-full flex flex-col" style={styles.accent}>
                  <img
                    src={`${API_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover mb-4 rounded-lg shadow-md"
                  />
                  <div className="mx-auto text-center">
                    <h3 className="text-xl font-semibold mb-2" style={styles.text}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                    <span className="text-2xl font-bold" style={styles.text}>
                      ₦{product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            style={styles.primary}
          >
            &#10094;
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            style={styles.primary}
          >
            &#10095;
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {visibleProducts.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full mx-1 ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              style={index === currentIndex ? styles.primary : {}}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;