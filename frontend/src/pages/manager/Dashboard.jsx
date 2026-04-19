import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_PROXY = "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [toast, setToast] = useState({ show: false, message: '' });

  // Live Stats State
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringSoon, setExpiringSoon] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);

  const fetchOrders = () => {
    axios.get(`${API_PROXY}/orders`).then(res => {
      setOrders(res.data);
    }).catch(err => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Fetch Products
    axios.get(`${API_PROXY}/products`).then(res => {
      setTotalProductsCount(res.data.length);
      const lowStock = res.data.filter(p => p.stock <= p.lowThreshold);
      setLowStockCount(lowStock.length);
    }).catch(err => console.error("Error fetching products:", err));

    // Fetch Expiring Batches
    axios.get(`${API_PROXY}/expiring-products`).then(res => {
      setExpiringSoon(res.data || []);
    }).catch(err => console.error("Error fetching expiring batches:", err));

    // Fetch Delivery Staff
    axios.get(`${API_PROXY}/staff`).then(res => {
      const dbStaff = res.data || [];
      const dbDeliveryBoys = dbStaff.filter(s => s.role === 'Delivery');
      setDeliveryStaff(dbDeliveryBoys);
    }).catch(err => console.error("Error fetching staff:", err));

    fetchOrders();

    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const handleAssign = async (orderId, deliveryBoyId, deliveryBoyName) => {
    if (!deliveryBoyId) {
      showToast('⚠️ Please select a Delivery Boy first!');
      return;
    }

    try {
      await axios.put(`${API_PROXY}/updateOrderStatus/${orderId}`, {
        status: 'Assigned',
        delivery_boy_id: deliveryBoyId
      });
      showToast(`📌 Order assigned to ${deliveryBoyName}!`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      showToast('❌ Error assigning order');
    }
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const assignedOrders = orders.filter(o => o.status !== 'Pending');

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
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-3xl font-black text-indigo-600 mt-2">{totalProductsCount}</p>
          <p className="text-indigo-400 text-xs mt-1">Live from database</p>
        </div>
        <div
          onClick={() => navigate('/manager/view_products')}
          className="bg-red-50 p-6 rounded-2xl shadow border border-red-200 hover:scale-105 transition cursor-pointer"
        >
          <p className="text-gray-400 text-sm font-semibold">Low Stock Products</p>
          <p className="text-3xl font-black text-red-600 mt-2">{lowStockCount}</p>
          <p className="text-red-500 font-bold text-xs mt-1 underline">Click to view &rarr;</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Pending Orders</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{pendingOrders.length}</p>
          <p className="text-orange-400 text-xs mt-1">Not yet assigned</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Dispatched Orders</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{assignedOrders.length}</p>
          <p className="text-blue-400 text-xs mt-1">Status assigned/transit</p>
        </div>
      </div>

      {/* Expiry Alert Banner */}
      {expiringSoon.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="text-3xl">⏳</div>
          <div className="flex-1">
            <p className="font-bold text-amber-700 text-lg">Inventory Expiring Soon!</p>
            <p className="text-amber-600 text-sm mt-0.5">
              {expiringSoon
                .map((b) => `${b.product_name} (Expires: ${new Date(b.expiry_date).toLocaleDateString()})`)
                .join(" · ")}
            </p>
            <p className="text-amber-400 text-xs mt-1 font-semibold italic">* Proactive batch rotation suggested</p>
          </div>
          <button
            onClick={() => axios.get(`${API_PROXY}/trigger-alerts`).then(() => showToast("📨 Email alerts dispatched to managers!"))}
            className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-amber-700 transition"
          >
            Dispatch Alerts 📨
          </button>
        </div>
      )}

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
            <OrderItem key={order.id} order={order} deliveryStaff={deliveryStaff} onAssign={handleAssign} />
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
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">🛵 Ongoing Assigned Orders</h2>
          <button
            className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition"
            onClick={fetchOrders}
          >
            ↻ Refresh State
          </button>
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
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {assignedOrders.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-6 text-gray-400 font-semibold text-xs">No assigned orders yet.</td></tr>
              ) : ''}
              {assignedOrders.map((order, idx) => (
                <tr key={idx} className={`hover:bg-gray-50 ${order.status === 'Assigned' ? 'bg-green-50/50' : ''}`}>
                  <td className="py-3 px-6 font-bold">#ORD-{order.id}</td>
                  <td className="px-6">{order.shop || order.customer_name}</td>
                  <td className="px-6 font-semibold text-indigo-600">₹{order.amount}</td>
                  <td className="px-6 font-medium">🛵 {order.delivery_boy_name || "—"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700 border border-green-200' :
                        'bg-orange-100 text-orange-700'
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

function OrderItem({ order, deliveryStaff, onAssign }) {
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');

  return (
    <div className="border-2 border-orange-100 rounded-2xl p-5 hover:border-orange-300 transition bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-black text-gray-800 text-lg">#ORD-{order.id}</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">Pending</span>
          </div>
          <p className="text-sm text-gray-600">🏪 <span className="font-semibold">{order.shop || order.customer_name}</span> — {order.customer_addr}</p>
          <p className="text-sm text-gray-500 mt-1">📦 {order.items_summary || "Check details"}</p>
          <p className="text-sm text-indigo-600 font-semibold mt-1">💰 Total: ₹{order.amount}</p>
          <p className="text-xs text-gray-400 mt-1">📅 Placed: {new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:min-w-[220px]">
          <select
            value={selectedDeliveryBoy}
            onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
            className="border-2 border-gray-200 p-2 rounded-xl text-sm focus:border-indigo-400 outline-none w-full bg-white text-gray-700"
          >
            <option value="">Select Delivery Boy</option>
            {deliveryStaff.map(s => <option key={s.id} value={s.id}>🛵 {s.name}</option>)}
          </select>
          <button
            onClick={() => {
              const boy = deliveryStaff.find(s => s.id === Number(selectedDeliveryBoy));
              onAssign(order.id, selectedDeliveryBoy, boy?.name);
            }}
            className="bg-indigo-600 text-white py-2 px-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow"
          >
            📌 Assign Order
          </button>
        </div>
      </div>
    </div>
  );
}
