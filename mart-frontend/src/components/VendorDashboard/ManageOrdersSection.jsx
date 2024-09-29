// src/components/VendorDashboard/ManageOrdersSection.jsx

import React, { useState, useEffect } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Alert } from './UIComponents';
import api, { updateOrderStatus } from '../../config/api';

export default function ManageOrdersSection() {
  const { orders, setOrders } = useVendor();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/`);
      setSelectedOrder(response.data);
      setIsModalOpen(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details. Please try again.');
    }
  };
  
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.delete(`/orders/${orderId}/`);
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

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
      setError(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && !event.target.closest('.modal-content')) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Orders</h2>
      {error && <Alert type="error">{error}</Alert>}
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

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content">
            <h3 className="text-2xl font-bold mb-4">Order Details</h3>
            <div className="space-y-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
              <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
              <p><strong>Customer Phone:</strong> {selectedOrder.customer_phone}</p>
              <p><strong>Customer Address:</strong> {selectedOrder.customer_address}</p>
              <p><strong>Total Amount:</strong> ₦{parseFloat(selectedOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <div>
                <strong>Status:</strong>
                <select
                  value={selectedOrder.status || 'pending'}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                  className="ml-2 border rounded p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <h4 className="font-medium text-gray-900">Order Items:</h4>
              <ul className="list-disc pl-5">
                {selectedOrder.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} - Quantity: {item.quantity}, Price: ₦{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={closeModal} className="mt-6">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}