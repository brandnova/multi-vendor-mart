import React, { useState, useEffect } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, Button, Alert, Modal, Select, Spinner } from './UIComponents';
import { FaEye, FaTrash, FaFileAlt, FaMoneyBillWave } from "react-icons/fa";
import { getOrders, getOrderDetails, updateOrderStatus, deleteOrder } from '../../config/api';

export default function ManageOrdersSection() {
  const { orders, setOrders } = useVendor();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentProofModalOpen, setIsPaymentProofModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setIsLoading(true);
    try {
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setNewStatus(orderDetails.status);
      setIsOrderModalOpen(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    setIsLoading(true);
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
        setIsOrderModalOpen(false);
      }
      setError(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Failed to delete order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsLoading(true);
    try {
      const updatedOrder = await updateOrderStatus(selectedOrder.id, newStatus);
      setOrders(orders.map(order => order.id === selectedOrder.id ? updatedOrder : order));
      setSelectedOrder(updatedOrder);
      setError(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const openPaymentProofModal = () => {
    setIsPaymentProofModalOpen(true);
  };

  const closePaymentProofModal = () => {
    setIsPaymentProofModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Orders</h2>
      {error && <Alert type="error">{error}</Alert>}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Order List</h3>
        </CardHeader>
        <CardContent>
          {isLoading && <Spinner size="lg" className="mx-auto" />}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button onClick={() => fetchOrderDetails(order.id)} variant="secondary" size="sm" className="mr-2">
                            <FaEye className="mr-1" /> View
                          </Button>
                          <Button onClick={() => handleDeleteOrder(order.id)} variant="danger" size="sm">
                            <FaTrash className="mr-1" /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-sm text-gray-500 text-center">No orders available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isOrderModalOpen} onClose={closeOrderModal} title={`Order Details - #${selectedOrder?.id}`}>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Customer Name:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Customer Email:</strong> {selectedOrder.customer_email}</p>
                <p><strong>Customer Phone:</strong> {selectedOrder.customer_phone}</p>
              </div>
              <div>
                <p><strong>Customer Address:</strong> {selectedOrder.customer_address}</p>
                <p><strong>Total Amount:</strong> ₦{parseFloat(selectedOrder.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p><strong>Tracking Number:</strong> {selectedOrder.tracking_number}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <strong>Status:</strong>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="inline-block w-auto"
              >
                <option value="pending">Pending</option>
                <option value="payment_confirmed">Payment Confirmed</option>
                <option value="payment_not_confirmed">Payment Not Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <Button onClick={handleUpdateOrderStatus} variant="primary" size="sm">
                Update Status
              </Button>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
              <ul className="list-disc pl-5">
                {selectedOrder.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} - Quantity: {item.quantity}, Price: ₦{parseFloat(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </li>
                ))}
              </ul>
            </div>
            {selectedOrder.payment_proof && (
              <div>
                <Button onClick={openPaymentProofModal} variant="secondary" size="sm">
                  <FaMoneyBillWave className="mr-1" /> View Payment Proof
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={isPaymentProofModalOpen} onClose={closePaymentProofModal} title="Payment Proof">
        {selectedOrder && selectedOrder.payment_proof && (
          <div className="flex justify-center items-center">
            {selectedOrder.payment_proof.toLowerCase().endsWith('.pdf') ? (
              <div className="flex items-center">
                <FaFileAlt className="text-red-500 mr-2" size={24} />
                <a
                  href={selectedOrder.payment_proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF Payment Proof
                </a>
              </div>
            ) : (
              <img
                src={selectedOrder.payment_proof}
                alt="Payment Proof"
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}