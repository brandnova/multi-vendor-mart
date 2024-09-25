import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Card, CardContent, CardHeader, Button } from './UIComponents';

export default function ManageOrdersSection() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch orders. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      const errorMessage = err.response?.data?.message || 'Failed to fetch order details. Please try again.';
      setError(errorMessage);
    }
  };
  
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/orders/${orderId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter(order => order.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete order. Please try again.';
      setError(errorMessage);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Orders</h2>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Order List</h3>
              <Button onClick={fetchOrders} className="bg-blue-500 hover:bg-blue-600 text-white">
                Refresh Orders
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <li key={order.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customer_name}</p>
                      </div>
                      <div className="space-x-2">
                        <Button onClick={() => fetchOrderDetails(order.id)} className="bg-green-500 hover:bg-green-600 text-white">
                          View Details
                        </Button>
                        <Button onClick={() => deleteOrder(order.id)} className="bg-red-500 hover:bg-red-600 text-white">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-sm text-gray-500">No orders available.</li>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className="space-y-4">
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Customer Phone:</strong> {selectedOrder.customer_phone}</p>
                <p><strong>Customer Address:</strong> {selectedOrder.customer_address}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.total_amount}</p>
                <h4 className="font-medium text-gray-900">Order Items:</h4>
                <ul className="list-disc pl-5">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id}>
                      {item.product_name} - Quantity: {item.quantity}, Price: ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No orders selected.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
