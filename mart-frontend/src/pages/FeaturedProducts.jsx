import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedProducts = ({ products, styles }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
    setVisibleProducts(randomProducts);
  }, [products]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % visibleProducts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + visibleProducts.length) % visibleProducts.length);
  };

  if (visibleProducts.length === 0) return null;

  return (
    <section className="py-6 md:py-8" style={styles.secondary}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center" style={styles.text}>
          Featured Products
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out" 
                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {visibleProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  <div className="rounded-lg shadow-lg p-4 h-full flex flex-col" style={styles.accent}>
                    <div className="relative h-48 md:h-64 w-full mb-4 overflow-hidden rounded-lg">
                      <img
                        src={`${API_URL}${product.image}`}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center flex-grow flex flex-col justify-between">
                      <h3 className="text-lg font-semibold mb-2" style={styles.text}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <span className="text-xl font-bold" style={styles.text}>
                        ₦{product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 md:p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300"
            style={styles.primary}
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} className="font-semibold" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 md:p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300"
            style={styles.primary}
            aria-label="Next slide"
          >
            <ChevronRight size={24} className="font-semibold" />
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {visibleProducts.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 md:h-3 md:w-3 rounded-full mx-1 transition-colors duration-300 ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              style={index === currentIndex ? styles.primary : {}}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;