import { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROXY = "http://localhost:5000";

const statusConfig = {
  'Assigned': { color: 'bg-orange-100 text-orange-700', icon: '⏳', next: 'In Transit', btn: '🚀 Dispatch Order' },
  'In Transit': { color: 'bg-blue-100 text-blue-700', icon: '🛵', next: 'Delivered', btn: '✅ Mark Delivered' },
  'Delivered': { color: 'bg-green-100 text-green-700', icon: '💰', next: 'Paid', btn: '💵 Deposit Cash' },
  'Paid': { color: 'bg-emerald-100 text-emerald-700', icon: '✅', next: null, btn: null }
};

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'deposit', or 'history'
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignedRes, historyRes] = await Promise.all([
        axios.get(`${API_PROXY}/delivery/assigned`),
        axios.get(`${API_PROXY}/delivery/history`)
      ]);
      setOrders(assignedRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching delivery data:", err);
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_PROXY}/updateOrderStatus/${orderId}`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}!`, 'success');
      fetchData(); // Refresh both lists

      // Auto-switch tab if marking as delivered
      if (newStatus === 'Delivered') {
        setActiveTab('deposit');
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Failed to update status", "error");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading your deliveries...</div>;

  // Filter Logic
  const activeOrders = orders.filter(o => o.status === 'Assigned' || o.status === 'In Transit');
  const depositOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 md:p-10 rounded-[2rem] mb-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30">
            🛵
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black">Hello, {user?.name || 'Helper'}!</h1>
            <p className="opacity-90 mt-1 text-sm font-bold uppercase tracking-widest">Delivery Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/10 px-6 py-4 rounded-3xl backdrop-blur-sm text-center">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Queue</p>
            <p className="text-2xl font-black">{activeOrders.length}</p>
          </div>
          <div className="bg-emerald-500/20 px-6 py-4 rounded-3xl backdrop-blur-sm text-center border border-emerald-400/30">
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Stock Cash</p>
            <p className="text-2xl font-black">₹{depositOrders.reduce((sum, o) => sum + Number(o.amount), 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 bg-gray-100 p-2 rounded-[1.5rem] w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🚀 Active Queue <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg ml-1">{activeOrders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'deposit' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          💰 Deposit Cash <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg ml-1">{depositOrders.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-gray-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-700'}`}
        >
          📅 Previous Orders
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-dashed border-gray-200">
                <div className="text-7xl mb-6">🏜️</div>
                <h2 className="text-2xl font-black text-gray-800">Queue is Empty!</h2>
                <p className="text-gray-400 mt-2">No active deliveries assigned to you right now.</p>
              </div>
            ) : (
              activeOrders.map(order => {
                const cfg = statusConfig[order.status];
                return (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-2xl text-gray-800">{order.order_number}</span>
                          <span className={`${cfg.color} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                            {cfg.icon} {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Shop / Customer</p>
                            <p className="font-bold text-gray-800">{order.customer_name}</p>
                            <p className="text-[11px] text-gray-500 mt-1">{order.addr}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Orders Summary</p>
                            <p className="text-[11px] text-gray-700 leading-relaxed italic">"{order.items_summary}"</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-auto text-right flex flex-col justify-between h-full min-h-[140px]">
                        <div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Collectable</p>
                          <p className="font-black text-3xl text-indigo-600">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          onClick={() => handleStatusChange(order.id, cfg.next)}
                          className="w-full bg-indigo-600 text-white py-4 px-8 rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                        >
                          {cfg.btn}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">💵</div>
                <div>
                  <h2 className="text-xl font-black text-emerald-800 tracking-tight">Deposit Outstanding Cash</h2>
                  <p className="text-emerald-600 text-sm font-medium">Items delivered but cash not yet handed over to cashier.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-emerald-400">Total Settlement</p>
                <p className="text-3xl font-black text-emerald-700">₹{depositOrders.reduce((s, o) => s + Number(o.amount), 0).toLocaleString()}</p>
              </div>
            </div>
            {depositOrders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-dashed border-gray-200">
                <div className="text-7xl mb-6">💎</div>
                <h2 className="text-2xl font-black text-gray-800">All Settled!</h2>
                <p className="text-gray-400 mt-2">You don't have any pending cash deposits.</p>
              </div>
            ) : (
              depositOrders.map(order => (
                <div key={order.id} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-800">{order.order_number}</span>
                      <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic">Delivered</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{order.customer_name}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount to Handover</p>
                    <p className="text-2xl font-black text-emerald-600">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => handleStatusChange(order.id, 'Paid')}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition text-xs uppercase tracking-widest shadow-xl shadow-emerald-100"
                  >
                    Hand Over to Cashier 🏦
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.map(order => (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-800">{order.order_number}</span>
                    <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-600 uppercase">{order.customer_name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">📅 {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-emerald-600">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase">Settled</p>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 font-black uppercase tracking-widest">No history found.</div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-8 py-5 rounded-2xl shadow-2xl font-black z-50 transition-all animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
