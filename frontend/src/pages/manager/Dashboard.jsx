import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [pendingOrders, setPendingOrders] = useState([
    { id: '301', customer: 'Ramesh General Store', location: 'Village Khari, Dist. Anand', items: 'Chocolate Cone × 5 cartons, Vanilla Cone × 3 cartons', total: '₹7,560', placed: '10 Mar 2026, 10:30 AM' },
    { id: '302', customer: 'Patel Kirana Shop', location: 'Nadiad, Kheda', items: 'Mango Shake × 10 cartons, Family Pack × 2 cases', total: '₹14,880', placed: '10 Mar 2026, 11:15 AM' },
    { id: '303', customer: 'Sharma Cold Store', location: 'Anklav, Anand', items: 'Strawberry Cup × 8 cartons, Butterscotch Cup × 6 cartons', total: '₹8,760', placed: '10 Mar 2026, 12:00 PM' },
    { id: '304', customer: 'Kumar Sweets & Stores', location: 'Borsad, Anand', items: 'Chocolate Cone × 12 cartons, Mango Shake × 5 cartons', total: '₹13,440', placed: '10 Mar 2026, 1:00 PM' }
  ]);
  
  const [assignedOrders, setAssignedOrders] = useState([
    { id: '298', customer: 'Mehta Traders', total: '₹9,200', deliveryBoy: 'Neha Singh', status: 'In Transit' },
    { id: '299', customer: 'Joshi Provisions', total: '₹5,760', deliveryBoy: 'Rohit Das', status: 'Picked Up' }
  ]);
  
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const handleAssign = (orderId, deliveryBoy) => {
    if (!deliveryBoy) {
      alert('Please select a Delivery Boy first!');
      return;
    }
    
    // Move order to assigned
    const orderToAssign = pendingOrders.find(o => o.id === orderId);
    setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
    
    setAssignedOrders([
      { id: orderId, customer: '—', total: '—', deliveryBoy, status: 'Assigned ✓' },
      ...assignedOrders
    ]);
    
    showToast(`📌 #ORD-${orderId} assigned to ${deliveryBoy}!`);
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">📊 Manager Dashboard</h1>
          <p className="opacity-80 mt-1 text-sm">Receive orders and assign them to Delivery Boys</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs md:text-sm opacity-70 hidden sm:block">{formattedDate}</div>
          <div className="text-lg md:text-2xl font-bold mt-1">{formattedTime}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">New Orders</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{pendingOrders.length}</p>
          <p className="text-orange-400 text-xs mt-1">Not yet assigned</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Assigned</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{assignedOrders.length}</p>
          <p className="text-blue-400 text-xs mt-1">Delivery in progress</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Delivered Today</p>
          <p className="text-3xl font-black text-green-600 mt-2">5</p>
          <p className="text-green-400 text-xs mt-1">Cash collection pending</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Orders Today</p>
          <p className="text-3xl font-black text-indigo-600 mt-2">12</p>
        </div>
      </div>

      {/* PENDING ORDERS — ASSIGN TO DELIVERY BOY */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="flex justify-between items-center p-6 border-b bg-orange-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">⏳ Pending Orders — Assign to Delivery Boy</h2>
            <p className="text-gray-400 text-sm mt-0.5">These orders are placed by customers and need to be assigned</p>
          </div>
          <span className="bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
            {pendingOrders.length} Unassigned
          </span>
        </div>
        <div className="p-6 space-y-4">
          {pendingOrders.map(order => (
            <OrderItem key={order.id} order={order} onAssign={handleAssign} />
          ))}

          {pendingOrders.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-semibold text-lg">All orders have been assigned!</p>
            </div>
          )}
        </div>
      </div>

      {/* ONGOING ASSIGNED ORDERS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">🛵 Ongoing Assigned Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="px-6 text-left">Customer</th>
                <th className="px-6 text-left">Amount</th>
                <th className="px-6 text-left">Assigned To</th>
                <th className="px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {assignedOrders.map((order, idx) => (
                <tr key={idx} className={`border-b hover:bg-gray-50 ${order.status === 'Assigned ✓' ? 'bg-green-50' : ''}`}>
                  <td className="py-3 px-6 font-bold">#ORD-{order.id}</td>
                  <td className="px-6">{order.customer}</td>
                  <td className="px-6 font-semibold text-indigo-600">{order.total}</td>
                  <td className="px-6">🛵 {order.deliveryBoy}</td>
                  <td className="px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Picked Up' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all">
          {toast.message}
        </div>
      )}
    </div>
  );
}

function OrderItem({ order, onAssign }) {
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');

  return (
    <div className="border-2 border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-gray-800 text-lg">#ORD-{order.id}</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <p className="text-sm text-gray-600">🏪 <span className="font-semibold">{order.customer}</span> — {order.location}</p>
          <p className="text-sm text-gray-500 mt-1">📦 {order.items}</p>
          <p className="text-sm text-indigo-600 font-semibold mt-1">💰 Total: {order.total}</p>
          <p className="text-xs text-gray-400 mt-1">📅 Placed: {order.placed}</p>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px]">
          <select 
            value={selectedDeliveryBoy}
            onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded-xl text-sm focus:border-indigo-400 outline-none"
          >
            <option value="">— Select Delivery Boy —</option>
            <option value="Neha Singh">🛵 Neha Singh</option>
            <option value="Rohit Das">🛵 Rohit Das</option>
            <option value="Arjun Mehta">🛵 Arjun Mehta</option>
          </select>
          <button 
            onClick={() => onAssign(order.id, selectedDeliveryBoy)}
            className="bg-indigo-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition"
          >
            📌 Assign Order
          </button>
        </div>
      </div>
    </div>
  );
}
