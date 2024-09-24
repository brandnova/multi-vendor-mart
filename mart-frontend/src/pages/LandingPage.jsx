import React, { useState } from 'react';
import { FaStore, FaChartLine, FaGlobe, FaUserFriends, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-6 sticky top-0">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-blue-600">VendorHub</div>
          <button onClick={toggleMenu} className="md:hidden text-gray-600 focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
              <li><a href="#benefits" className="text-gray-600 hover:text-blue-600">Benefits</a></li>
              <li><a href="#cta" className="text-gray-600 hover:text-blue-600">Get Started</a></li>
            </ul>
          </nav>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <ul className="flex flex-col space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-blue-600" onClick={toggleMenu}>Features</a></li>
              <li><a href="#benefits" className="text-gray-600 hover:text-blue-600" onClick={toggleMenu}>Benefits</a></li>
              <li><a href="#cta" className="text-gray-600 hover:text-blue-600" onClick={toggleMenu}>Get Started</a></li>
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Empower Your Business with VendorHub</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">The ultimate platform for local vendors to create, manage, and grow their online presence.</p>
          <Link to="/auth" className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300">Start Selling Today</Link>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose VendorHub?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<FaStore className="text-5xl text-blue-600 mb-4" />}
                title="Easy Store Setup"
                description="Create your online store in minutes with our intuitive interface."
              />
              <FeatureCard 
                icon={<FaChartLine className="text-5xl text-blue-600 mb-4" />}
                title="Growth Analytics"
                description="Track your sales and customer engagement with powerful analytics tools."
              />
              <FeatureCard 
                icon={<FaGlobe className="text-5xl text-blue-600 mb-4" />}
                title="Global Reach"
                description="Expand your customer base beyond local boundaries."
              />
              <FeatureCard 
                icon={<FaUserFriends className="text-5xl text-blue-600 mb-4" />}
                title="Customer Management"
                description="Build lasting relationships with integrated CRM features."
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="bg-gray-100 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Benefits of Joining VendorHub</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <BenefitCard 
                title="Increased Visibility"
                description="Get discovered by customers looking for products like yours."
              />
              <BenefitCard 
                title="Secure Transactions"
                description="Our platform ensures safe and reliable payment processing."
              />
              <BenefitCard 
                title="24/7 Support"
                description="Our dedicated team is always ready to assist you."
              />
              <BenefitCard 
                title="Marketing Tools"
                description="Access to promotional features to boost your sales."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-lg md:text-xl mb-8">Join thousands of successful vendors on VendorHub and take your business to the next level.</p>
            <Link to="/auth" className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">Create Your Store Now</Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">&copy; 2023 VendorHub. All rights reserved.</div>
          <div>
            <a href="#" className="mr-4 hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    {icon}
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BenefitCard = ({ title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;