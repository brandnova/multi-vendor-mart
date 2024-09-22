import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Multi-Vendor Platform</h1>
      <p className="text-xl mb-8">Find great products from various vendors or start selling today!</p>
      <div className="space-x-4">
        <Link to="/stores" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Browse Stores
        </Link>
        <Link to="/become-vendor" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Become a Vendor
        </Link>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
        <form className="max-w-md mx-auto">
          <input type="text" placeholder="Your Name" className="w-full mb-2 p-2 border rounded" />
          <input type="email" placeholder="Your Email" className="w-full mb-2 p-2 border rounded" />
          <textarea placeholder="Your Review" className="w-full mb-2 p-2 border rounded" rows="4"></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Submit Review
          </button>
        </form>
      </div>
      {/* Google Ads Placeholder */}
      <div className="mt-8 bg-gray-200 p-4 text-center">
        Google Ads Placeholder
      </div>
    </div>
  );
};

export default LandingPage;