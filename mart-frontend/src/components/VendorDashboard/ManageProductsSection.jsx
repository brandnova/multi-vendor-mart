import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Card, CardContent, CardHeader, Button, Input, TextArea } from './UIComponents';

export default function ManageProductsSection() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: null,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stores/products/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewProduct((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setNewProduct((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSaveProduct = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };
    const formData = new FormData();
    
    for (const key in newProduct) {
      formData.append(key, newProduct[key]);
    }

    try {
      let response;
      if (editingProductId) {
        response = await axios.put(`${API_URL}/stores/products/${editingProductId}/`, formData, { headers });
        setProducts(products.map(product => product.id === editingProductId ? response.data : product));
      } else {
        response = await axios.post(`${API_URL}/stores/products/`, formData, { headers });
        setProducts([...products, response.data]);
      }
      setNewProduct({ name: '', description: '', price: '', quantity: '', image: null });
      setEditingProductId(null);
      setImagePreview(null);
      setError(null);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API_URL}/stores/products/${productId}/`, { headers });
      setProducts(products.filter(product => product.id !== productId));
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
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

  if (isLoading) {
    return <div>Loading products...</div>;
  }

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
              accept="image/*"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Product preview" className="mt-2 max-w-xs rounded-lg shadow-md" />
            )}
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
        <Button onClick={handleSaveProduct}>{editingProductId ? 'Update Product' : 'Create Product'}</Button>
          {editingProductId && (
            <Button onClick={() => setEditingProductId(null)} className="ml-2">Cancel</Button>
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
}