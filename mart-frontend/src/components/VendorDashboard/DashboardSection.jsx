import React, { useState, useEffect, useMemo } from 'react';
import { useVendor } from '../../context/VendorContext';
import { FaNairaSign } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle, Button } from './UIComponents';
import { MapPin, Package, ShoppingCart, Mail, Phone, ExternalLink, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_CHOICES = [
  { value: 'pending', label: 'Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'payment_not_confirmed', label: 'Payment Not Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const DashboardSection = () => {
  const { storeData, products, orders } = useVendor();
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    selectedProduct: 'all',
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const dateInRange = (!filters.dateRange.start || orderDate >= filters.dateRange.start) &&
                          (!filters.dateRange.end || orderDate <= filters.dateRange.end);
      const productMatch = filters.selectedProduct === 'all' ||
                           order.items.some(item => item.product === filters.selectedProduct);
      return dateInRange && productMatch;
    });
  }, [orders, filters]);

  const totalRevenue = useMemo(() => 
    filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
    [filteredOrders]
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: { start: null, end: null },
      selectedProduct: 'all',
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-lg">
        <img
          src={storeData.banner_image || '/placeholder.svg?height=256&width=1024'}
          alt={`${storeData.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{storeData.name}</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center text-white/80 space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.location}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.contact_email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              <span className="text-sm md:text-base">{storeData.contact_phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
        <Link
          to={`/stores/${storeData.slug}`}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-2 text-sm md:text-base">Visit Store Page</span>
          <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
        </Link>
      </div>

      {/* Filters section */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
            <div className="w-full sm:w-auto flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <span className="hidden sm:inline">from</span>
                <DateInput
                  value={filters.dateRange.start}
                  onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, start: date })}
                  placeholder="Start Date"
                />
                <span className="hidden sm:inline">to</span>
                <DateInput
                  value={filters.dateRange.end}
                  onChange={(date) => handleFilterChange('dateRange', { ...filters.dateRange, end: date })}
                  placeholder="End Date"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto flex-grow">
              <label htmlFor="product-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                id="product-filter"
                value={filters.selectedProduct}
                onChange={(e) => handleFilterChange('selectedProduct', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              >
                <option value="all">All Products</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={clearFilters} variant="outline" className="flex items-center w-full sm:w-auto justify-center">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<FaNairaSign className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Total Orders"
          value={filteredOrders.length}
          icon={<ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<Package className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.primary_color}
        />
      </div>

      {/* Recent Orders section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 pr-4">Order ID</th>
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{order.id}</td>
                      <td className="py-2 pr-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">₦{parseFloat(order.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {STATUS_CHOICES.find(choice => choice.value === order.status)?.label || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No orders found for the selected filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DateInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full">
      <input
        type="date"
        value={value ? value.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 pr-10"
        placeholder={placeholder}
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Card style={{ borderColor: color }}>
    <div className="mr-4" style={{ color }}>
      {icon}
    </div>
    <div>
      <CardTitle className="text-sm md:text-base">{title}</CardTitle>
      <p className="text-xl md:text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  </Card>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'payment_confirmed':
      return 'bg-green-100 text-green-800';
    case 'payment_not_confirmed':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-teal-100 text-teal-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default DashboardSection;