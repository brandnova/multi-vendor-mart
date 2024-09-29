// src/components/VendorDashboard/ManageProductsSection.jsx

import React, { useState, useEffect } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Input, TextArea } from './UIComponents';
import * as api from '../../config/api';

export default function ManageProductsSection() {
  const { products, setProducts } = useVendor();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProduct = async () => {
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      let response;
      if (editingProductId) {
        response = await api.updateProduct(editingProductId, formDataToSend);
        setProducts(products.map(product => product.id === editingProductId ? response : product));
      } else {
        response = await api.createProduct(formDataToSend);
        setProducts([response, ...products]);
      }
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
    });
    setImagePreview(product.image);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', quantity: '', image: null });
    setEditingProductId(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Products</h2>
      {error && <div className="text-red-500">{error}</div>}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Image"
              name="image"
              type="file"
              onChange={handleInputChange}
              accept="image/*"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Product preview" className="mt-2 max-w-xs rounded-lg shadow-md" />
            )}
            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="md:col-span-2"
            />
          </div>
        </CardContent>
        <CardHeader>
          <Button onClick={handleSaveProduct}>{editingProductId ? 'Update Product' : 'Create Product'}</Button>
          {editingProductId && (
            <Button onClick={resetForm} className="ml-2">Cancel</Button>
          )}
        </CardHeader>
      </Card>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Products</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-indigo-600 truncate">{product.name}</h4>
                      <p className="mt-1 text-sm text-gray-600 truncate">{product.description}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">₦{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="mt-1 text-sm text-gray-500">In stock: {product.quantity}</p>
                    </div>
                    <div className="ml-4">
                      <Button onClick={() => startEditing(product)} className="mr-2">Edit</Button>
                      <Button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 hover:bg-red-600">Delete</Button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No products available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}