import React from 'react';
import { Card, CardContent, Button } from './UIComponents';
import { API_URL } from '../../config/api';


const DashboardSection = ({ storeData, products, bankDetails, setActiveSection }) => {
  return (
    <div>
      {storeData ? (
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">{storeData.name}</h2>
          <p className="mt-1 text-sm text-gray-600">{storeData.location}</p>
          {/* Store details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Store Details</h3>
            <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
              <div className="py-3 flex justify-between text-sm font-medium">
                <dt className="text-gray-500">Contact Email</dt>
                <dd className="text-gray-900">{storeData.contact_email}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm font-medium">
                <dt className="text-gray-500">Contact Phone</dt>
                <dd className="text-gray-900">{storeData.contact_phone}</dd>
              </div>
              <div className="py-3 flex justify-between text-sm font-medium">
                <dt className="text-gray-500">Store URL</dt>
                <dd className="text-gray-900">
                  <a href={`/stores/${storeData.slug}`} className="text-blue-600 hover:text-blue-500">
                  {API_URL}{`/stores/${storeData.slug}`}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          {/* Products */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <ul className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <li key={product.id} className="py-3 flex justify-between text-sm font-medium">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-gray-600">{product.description}</p>
                    </div>
                    <div>
                      <p className="text-gray-900">${product.price}</p>
                      <p className="text-gray-600">In stock: {product.quantity}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-3 text-sm text-gray-600">No products available</li>
              )}
            </ul>
          </div>
          {/* Bank Details */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Bank Details</h3>
            <ul className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
              {bankDetails.length > 0 ? (
                bankDetails.map((detail) => (
                  <li key={detail.id} className="py-3 flex justify-between text-sm font-medium">
                    <div>
                      <h4 className="font-medium text-gray-900">{detail.bank_name}</h4>
                      <p className="text-gray-600">Account Number: {detail.account_number}</p>
                    </div>
                    <div>
                      <p className="text-gray-900">{detail.account_name}</p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-3 text-sm text-gray-600">No bank details available</li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">You haven't created a store yet.</p>
          <Button onClick={() => setActiveSection('create-store')} className="mt-3">
            Create Store
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardSection;