import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const FeaturedProducts = ({ products }) => {
  const featuredProducts = products.slice(0, 5); 

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Featured Products</h2>
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-4 py-8">
              <img src={product.image} alt={product.name} className="w-64 h-64 object-cover mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;