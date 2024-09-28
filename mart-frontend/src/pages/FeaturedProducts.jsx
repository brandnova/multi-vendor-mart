import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { API_URL } from '../config/api';

const FeaturedProducts = ({ products, styles }) => {
  const featuredProducts = products.slice(0, 5); 

  return (
    <section className="py-16" style={styles.secondary}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center" style={styles.text}>
          Featured Products
        </h2>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          className="bg-white rounded-lg shadow-lg p-6"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...styles.primary, position: 'absolute', zIndex: 2, left: 15, top: '50%', width: 40, height: 40, borderRadius: '50%', opacity: 0.8, }}
                className="hover:opacity-75 transition-opacity duration-300 flex items-center justify-center"
              >
                <FaChevronLeft className="text-2xl" />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...styles.primary, position: 'absolute', zIndex: 2, right: 15, top: '50%', width: 40, height: 40, borderRadius: '50%', opacity: 0.8, }}
                className="hover:opacity-75 transition-opacity duration-300 flex items-center justify-center"
              >
                <FaChevronRight className="text-2xl" />
              </button>
            )
          }
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-4 py-8">
              <img 
                src={`${API_URL}${product.image}`}
                alt={product.name} 
                className="w-64 h-64 object-cover mx-auto mb-4 rounded-lg shadow-md"
              />
              <span className="text-xl font-semibold mb-2" style={styles.text}>
                {product.name}
              </span>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <span className="text-2xl font-bold" style={styles.text}>
                ${product.price}
              </span>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;