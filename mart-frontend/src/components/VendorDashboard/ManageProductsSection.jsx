import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input, TextArea } from './UIComponents';
import axios from 'axios';
import { API_URL } from '../../config/api';

const ManageProductsSection = ({ products, handleCreateProduct, handleEditProduct, handleDeleteProduct }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
    const formData = new FormData();
    
    for (const key in newProduct) {
      formData.append(key, newProduct[key]);
    }

    try {
      if (editingProductId) {
        const response = await axios.put(`${API_URL}/stores/products/${editingProductId}/`, formData, { headers });
        setProducts(products.map(product => product.id === editingProductId ? response.data : product));
      } else {
        const response = await axios.post(`${API_URL}/stores/products/`, formData, { headers });
        setProducts([...products, response.data]);
      }
      setNewProduct({ name: '', description: '', price: '', quantity: '', image: null });
      setEditingProductId(null);
    } catch (error) {
      console.error('Error saving product:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API_URL}/stores/products/${productId}/`, { headers });
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      image: null,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Manage Products</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Price"
                name="price"
                type="number"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={newProduct.quantity}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Image"
                name="image"
                type="file"
                onChange={handleInputChange}
              />
              <TextArea
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
                className="md:col-span-2"
              />
            </div>
          </CardContent>
          <CardHeader>
            <Button type="submit">{editingProductId ? 'Update Product' : 'Create Product'}</Button>
            {editingProductId && (
              <Button type="button" onClick={() => setEditingProductId(null)} className="ml-2">Cancel</Button>
            )}
          </CardHeader>
        </form>
      </Card>
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Products</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-indigo-600 truncate">{product.name}</h4>
                      <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
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
};

export default ManageProductsSection;