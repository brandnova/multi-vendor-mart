import React from 'react';
import { useVendor } from '../../context/VendorContext';
import { FaNairaSign } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from './UIComponents';
import { MapPin, Package, ShoppingCart, Mail, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardSection = () => {
  const { storeData, products, orders } = useVendor();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={<FaNairaSign className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.secondary_color}
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-6 h-6 md:w-8 md:h-8" />}
          color={storeData.accent_color}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
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
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{order.id}</td>
                      <td className="py-2 pr-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-2 pr-4">₦{order.total_amount.toLocaleString()}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Card className="flex items-center p-4 md:p-6" style={{ borderColor: color }}>
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
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default DashboardSection;