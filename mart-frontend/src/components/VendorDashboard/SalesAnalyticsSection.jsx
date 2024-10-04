import React, { useState, useMemo } from 'react';
import { useVendor } from '../../context/VendorContext';
import { Card, CardContent, CardHeader, CardTitle, Select } from './UIComponents';
import { FaNairaSign } from "react-icons/fa6";
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SalesAnalyticsSection = () => {
  const { storeData, products, orders } = useVendor();
  const [timeFrame, setTimeFrame] = useState('last30days');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const timeFrames = {
      last7days: new Date(now.setDate(now.getDate() - 7)),
      last30days: new Date(now.setDate(now.getDate() - 30)),
      last3months: new Date(now.setMonth(now.getMonth() - 3)),
      last6months: new Date(now.setMonth(now.getMonth() - 6)),
      lastYear: new Date(now.setFullYear(now.getFullYear() - 1))
    };

    return orders.filter(order => new Date(order.created_at) >= timeFrames[timeFrame]);
  }, [orders, timeFrame]);

  const salesData = useMemo(() => {
    const data = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.created_at).toLocaleDateString();
      if (!data[date]) {
        data[date] = { date, sales: 0, orders: 0 };
      }
      data[date].sales += parseFloat(order.total_amount);
      data[date].orders += 1;
    });
    return Object.values(data).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredOrders]);

  const productSalesData = useMemo(() => {
    const data = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!data[item.product_name]) {
          data[item.product_name] = { name: item.product_name, sales: 0, quantity: 0 };
        }
        data[item.product_name].sales += parseFloat(item.price) * item.quantity;
        data[item.product_name].quantity += item.quantity;
      });
    });
    return Object.values(data).sort((a, b) => b.sales - a.sales).slice(0, 5);
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => 
    filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
    [filteredOrders]
  );

  const averageOrderValue = useMemo(() => 
    filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
    [filteredOrders, totalRevenue]
  );

  const orderStatusData = useMemo(() => {
    const data = {};
    filteredOrders.forEach(order => {
      if (!data[order.status]) {
        data[order.status] = 0;
      }
      data[order.status]++;
    });
    return Object.entries(data).map(([status, count]) => ({ name: status, value: count }));
  }, [filteredOrders]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Sales Analytics</h2>
        <Select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="w-48"
        >
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last3months">Last 3 Months</option>
          <option value="last6months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<FaNairaSign className="w-6 h-6" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Total Orders"
          value={filteredOrders.length}
          icon={<ShoppingCart className="w-6 h-6" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Average Order Value"
          value={`₦${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color={storeData.primary_color}
        />
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<Package className="w-6 h-6" />}
          color={storeData.primary_color}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Sales (₦)" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Products by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales (₦)" />
                <Bar dataKey="quantity" fill="#82ca9d" name="Quantity Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent className="flex items-center p-4">
      <div className="mr-4 p-3 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default SalesAnalyticsSection;