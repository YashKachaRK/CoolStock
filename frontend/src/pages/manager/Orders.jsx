import { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROXY = "http://localhost:5000";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Completed'

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_PROXY}/orders`);
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Assigned': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'Pending') return matchesSearch && order.status === 'Pending';
    if (filter === 'Completed') return matchesSearch && order.status === 'Delivered';
    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Orders List</h1>
          <p className="text-gray-500 mt-1">Review live orders and manage delivery states</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white border text-gray-700 border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm"
          >
            <span>📥</span> Print List
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Unassigned', value: orders.filter(o => o.status === 'Pending').length, icon: '⏳', color: 'amber' },
          { label: 'In Transit', value: orders.filter(o => o.status === 'In Transit').length, icon: '🛵', color: 'blue' },
          { label: 'Completed', value: orders.filter(o => o.status === 'Delivered').length, icon: '✅', color: 'emerald' },
          { label: "Today's Revenue", value: `₹${orders.filter(o => o.status === 'Paid' || o.status === 'Delivered').reduce((s, o) => s + o.amount, 0).toLocaleString()}`, icon: '💵', color: 'indigo' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
            <div className={`relative z-10 flex justify-between items-start`}>
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-indigo-50 text-indigo-600 shadow-sm`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'Pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'Completed' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            >
              Delivered
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Order # or Shop..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Delivery Staff</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Placed On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10">Loading orders...</td></tr>
              ) : ''}
              {!loading && filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10">No orders found matching criteria.</td></tr>
              ) : ''}
              {filteredOrders.map((order, index) => (
                <tr key={index} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.order_number || `#ORD-${order.id}`}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{order.customer_name || 'Walk-in'}</p>
                    <p className="text-xs text-gray-400">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate">{order.items_summary || "No items"}</td>
                  <td className="px-6 py-4 font-black text-gray-800">₹{order.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                    {order.delivery_boy_name ? `🛵 ${order.delivery_boy_name}` : '—'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <button onClick={fetchOrders} className="text-indigo-600 hover:text-indigo-800 font-bold transition">↻ Refresh List</button>
        </div>
      </div>
    </div>
  );
}
