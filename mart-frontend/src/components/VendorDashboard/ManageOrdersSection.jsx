// src/components/VendorDashboard/ManageOrdersSection.jsx

import React, { useState } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button } from './UIComponents';
import * as api from '../../config/api';

export default function ManageOrdersSection() {
  const { orders, setOrders } = useVendor();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.getOrderDetails(orderId);
      setSelectedOrder(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details. Please try again.');
    }
  };
  
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Orders</h2>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Order List</h3>
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
              <p className="text-sm text-gray-500">No order selected.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}