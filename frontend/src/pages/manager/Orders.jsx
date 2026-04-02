import { useState } from 'react';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');

  // Static dummy data for orders
  const orders = [
    { id: 'ORD-8932', customer: 'SuperMart DT', date: 'Oct 24, 2023', total: 450.00, items: 45, status: 'Processing' },
    { id: 'ORD-8931', customer: 'Joe\'s Grocery', date: 'Oct 24, 2023', total: 125.50, items: 12, status: 'Pending' },
    { id: 'ORD-8930', customer: 'Fresh Pick Cafe', date: 'Oct 23, 2023', total: 890.00, items: 120, status: 'Delivered' },
    { id: 'ORD-8929', customer: 'Sunrise Market', date: 'Oct 23, 2023', total: 340.25, items: 34, status: 'Delivered' },
    { id: 'ORD-8928', customer: 'NightOwl Convenience', date: 'Oct 22, 2023', total: 75.00, items: 8, status: 'Cancelled' },
    { id: 'ORD-8927', customer: 'City Center Deli', date: 'Oct 22, 2023', total: 540.75, items: 65, status: 'Delivered' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Target Orders</h1>
          <p className="text-gray-500 mt-1">Review target orders and manage delivery states</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border text-gray-700 border-gray-200 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm">
            <span>📥</span> Export
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
            <span>+</span> New Order
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Pending Target', value: '45', subtext: '+12% from yesterday', icon: '⏳', color: 'amber' },
          { label: 'Processing', value: '18', subtext: 'In fulfillment center', icon: '⚙️', color: 'blue' },
          { label: 'Delivered Today', value: '124', subtext: '+4% from target', icon: '✅', color: 'emerald' },
          { label: "Today's Revenue", value: '$4,520', subtext: 'Total confirmed', icon: '💵', color: 'indigo' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${stat.color}-50 rounded-full group-hover:scale-110 transition duration-500`}></div>
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-${stat.color}-100 text-${stat.color}-600 shadow-sm`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 relative z-10 font-medium">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 rounded-lg text-sm transition">All Orders</button>
            <button className="px-4 py-2 bg-white text-gray-600 hover:bg-gray-50 font-medium border border-gray-200 rounded-lg text-sm transition">Pending</button>
            <button className="px-4 py-2 bg-white text-gray-600 hover:bg-gray-50 font-medium border border-gray-200 rounded-lg text-sm transition">Completed</button>
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
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
                <th className="px-6 py-4 font-bold tracking-wider">Order ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold tracking-wider">Items</th>
                <th className="px-6 py-4 font-bold tracking-wider">Total</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-bold tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 font-medium">{order.items} pcs</td>
                  <td className="px-6 py-4 font-black text-gray-800">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition bg-white border border-gray-200 rounded-lg hover:border-indigo-300 shadow-sm">
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Showing 6 of 840 target orders</span>
          <a href="#" className="text-indigo-600 hover:text-indigo-800 font-bold transition">View all orders →</a>
        </div>
      </div>
    </div>
  );
}
