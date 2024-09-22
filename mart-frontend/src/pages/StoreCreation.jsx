import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStore } from '../redux/storeSlice';
import { FaStore, FaUserCircle, FaBox, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const StoreCreation = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [storeData, setStoreData] = useState({
    name: '',
    location: '',
    contact_email: '',
    contact_phone: '',
  });
  const [accountDetails, setAccountDetails] = useState({
    bank_name: '',
    account_number: '',
    routing_number: '',
  });
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  const handleStoreDataChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleAccountDetailsChange = (e) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const handleProductDataChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createStore({ ...storeData, ...accountDetails, product: productData }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Store Details</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="name"
              value={storeData.name}
              onChange={handleStoreDataChange}
              placeholder="Store Name"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="location"
              value={storeData.location}
              onChange={handleStoreDataChange}
              placeholder="Location"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              name="contact_email"
              value={storeData.contact_email}
              onChange={handleStoreDataChange}
              placeholder="Contact Email"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="tel"
              name="contact_phone"
              value={storeData.contact_phone}
              onChange={handleStoreDataChange}
              placeholder="Contact Phone"
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
              onClick={nextStep}
            >
              Next <FaArrowRight className="inline ml-2" />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Account Details</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="bank_name"
              value={accountDetails.bank_name}
              onChange={handleAccountDetailsChange}
              placeholder="Bank Name"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="account_number"
              value={accountDetails.account_number}
              onChange={handleAccountDetailsChange}
              placeholder="Account Number"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="routing_number"
              value={accountDetails.routing_number}
              onChange={handleAccountDetailsChange}
              placeholder="Routing Number"
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition duration-200"
                onClick={prevStep}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                onClick={nextStep}
              >
                Next <FaArrowRight className="inline ml-2" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Add a Product</h2>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              name="name"
              value={productData.name}
              onChange={handleProductDataChange}
              placeholder="Product Name"
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              name="description"
              value={productData.description}
              onChange={handleProductDataChange}
              placeholder="Product Description"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="number"
              name="price"
              value={productData.price}
              onChange={handleProductDataChange}
              placeholder="Price"
            />
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleProductDataChange}
              placeholder="Quantity"
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 transition duration-200"
                onClick={prevStep}
              >
                <FaArrowLeft className="inline mr-2" /> Previous
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
                onClick={handleSubmit}
              >
                Create Store <FaCheck className="inline ml-2" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Store</h1>
      <div className="flex justify-between mb-8">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
          <FaStore className="text-3xl mb-2" />
          <span>Store Details</span>
        </div>
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
          <FaUserCircle className="text-3xl mb-2" />
          <span>Account Details</span>
        </div>
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
          <FaBox className="text-3xl mb-2" />
          <span>Add a Product</span>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default StoreCreation;