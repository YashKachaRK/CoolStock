import { useState, useEffect } from 'react';
import axios from 'axios';

// ── Status config matching our new MySQL-aligned statuses ─────────────────
const STATUS_CONFIG = {
  'Ordered':    { color: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-400',  icon: '⏳' },
  'Assigned':   { color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',    icon: '📌' },
  'In Transit': { color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500',  icon: '🛵' },
  'Deposited':  { color: 'bg-teal-100 text-teal-700',      dot: 'bg-teal-500',    icon: '💰' },
  'Paid':       { color: 'bg-green-100 text-green-700',    dot: 'bg-green-500',   icon: '✅' },
  'Cancelled':  { color: 'bg-red-100 text-red-700',        dot: 'bg-red-400',     icon: '❌' },
};

const URGENCY_COLOR = {
  'Normal': 'bg-gray-100 text-gray-600',
  'Urgent': 'bg-yellow-100 text-yellow-700',
};

const ALL_STATUSES = ['All', 'Ordered', 'Assigned', 'In Transit', 'Deposited', 'Paid', 'Cancelled'];

const API = 'http://localhost:5000';

export default function RecentOrders() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch]           = useState('');
  const [viewOrder, setViewOrder]     = useState(null);
  const [toast, setToast]             = useState({ show: false, message: '', ok: true });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      showToast('❌ Error fetching orders', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const showToast = (msg, ok = true) => {
    setToast({ show: true, message: msg, ok });
    setTimeout(() => setToast({ show: false, message: '', ok: true }), 3000);
  };

  // ── Filtering ─────────────────────────────────────────────────────────
  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    // customer_name is the API field (formatted from customer_id.shop/name)
    const customerLabel = o.customer_name || '';
    const orderNum = o.order_number || '';
    const matchSearch = customerLabel.toLowerCase().includes(search.toLowerCase())
                     || orderNum.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = ALL_STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const totalRevenue = orders
    .filter(o => o.status === 'Paid')
    .reduce((s, o) => s + Number(o.amount || 0), 0);

  // ── Cancel order ──────────────────────────────────────────────────────
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const admin = JSON.parse(localStorage.getItem('user') || '{}');
      await axios.put(`${API}/orders/cancel/${orderId}`, {
        cancelled_by: admin.id,
        remarks: 'Cancelled by Admin',
      });
      showToast('🗑️ Order cancelled successfully');
      setViewOrder(null);
      fetchOrders(); // refresh
    } catch (err) {
      showToast('❌ Error cancelling order', false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">📋</div>
        <p className="text-gray-500 font-semibold">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-700 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">🧾 All Orders</h1>
          <p className="opacity-80 mt-1 text-sm">Full view of all customer orders across every status</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs opacity-70 hidden sm:block">Total Revenue (Paid)</p>
          <p className="text-lg md:text-2xl font-black mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
        {ALL_STATUSES.slice(1).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`bg-white p-4 rounded-2xl shadow hover:scale-105 transition cursor-pointer border-2 ${statusFilter === s ? 'border-slate-600' : 'border-transparent'}`}
            >
              <p className="text-gray-400 text-xs font-semibold">{cfg.icon} {s}</p>
              <p className="text-3xl font-black text-gray-800 mt-1">{counts[s] || 0}</p>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Search + filter bar */}
        <div className="p-5 border-b bg-gray-50 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search by order ID or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-purple-400 outline-none w-full sm:w-72"
          />
          <div className="flex gap-2 flex-wrap">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === s ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'}`}
              >
                {s === 'All' ? '📋 All' : `${STATUS_CONFIG[s].icon} ${s}`}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400 font-semibold">{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-5 text-left">Order ID</th>
                <th className="px-5 text-left">Customer</th>
                <th className="px-5 text-left">Items</th>
                <th className="px-5 text-left">Amount</th>
                <th className="px-5 text-left">Date</th>
                <th className="px-5 text-left">Urgency</th>
                <th className="px-5 text-left">Delivery Boy</th>
                <th className="px-5 text-left">Status</th>
                <th className="px-5 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-gray-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-semibold">No orders found</p>
                  </td>
                </tr>
              ) : filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Ordered'];
                const dateStr = order.date
                  ? new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';
                return (
                  <tr key={order._id || order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-5 font-bold text-slate-700">{order.order_number}</td>
                    <td className="px-5">
                      <p className="font-semibold">{order.customer_name || '—'}</p>
                      <p className="text-xs text-gray-400">{order.customer_addr || ''}</p>
                    </td>
                    <td className="px-5 text-xs text-gray-500 max-w-[180px] truncate">
                      {order.items_summary || '—'}
                    </td>
                    <td className="px-5 font-bold text-purple-700">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                    <td className="px-5 text-gray-400 text-xs">{dateStr}</td>
                    <td className="px-5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${URGENCY_COLOR[order.urgency] || 'bg-gray-100 text-gray-600'}`}>
                        {order.urgency}
                      </span>
                    </td>
                    <td className="px-5 text-xs text-gray-600">
                      {order.delivery_boy_name ? `🛵 ${order.delivery_boy_name}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                        {cfg.icon} {order.status}
                      </span>
                    </td>
                    <td className="px-5">
                      <button
                        onClick={() => setViewOrder(order)}
                        className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition"
                      >
                        👁 View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setViewOrder(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-purple-700 text-white p-7">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-70">Order Details</p>
                  <h2 className="text-2xl font-black mt-0.5">{viewOrder.order_number}</h2>
                  <p className="text-sm opacity-80 mt-1">{new Date(viewOrder.date).toLocaleDateString('en-IN')}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20">
                  {STATUS_CONFIG[viewOrder.status]?.icon} {viewOrder.status}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-7 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase">Customer</p>
                <p className="font-black text-gray-800 text-lg">{viewOrder.customer_name}</p>
                <p className="text-sm text-gray-500">📍 {viewOrder.customer_addr}</p>
                {viewOrder.customer_phone && <p className="text-sm text-gray-500">📞 {viewOrder.customer_phone}</p>}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Items Ordered</p>
                <p className="text-sm text-gray-700">{viewOrder.items_summary || 'No items recorded'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Order Amount</p>
                  <p className="text-2xl font-black text-purple-700 mt-1">₹{Number(viewOrder.amount).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Urgency</p>
                  <p className="font-bold text-gray-700 mt-1">{viewOrder.urgency}</p>
                </div>
              </div>

              {/* Audit / History Trail */}
              {viewOrder.order_history && viewOrder.order_history.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3">Order History</p>
                  <div className="space-y-2">
                    {viewOrder.order_history.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-lg">{STATUS_CONFIG[h.action]?.icon || '📋'}</span>
                        <div>
                          <p className="font-bold text-gray-700">{h.action} <span className="font-normal text-gray-400">by {h.performed_by_name || 'System'}</span></p>
                          <p className="text-xs text-gray-400">{new Date(h.performed_at).toLocaleString('en-IN')} — {h.remarks}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery boy info */}
              {viewOrder.delivery_boy_name && (
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Assigned Delivery Boy</p>
                  <p className="font-bold text-blue-700 mt-1">🛵 {viewOrder.delivery_boy_name}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {viewOrder.status === 'Ordered' && (
                  <button
                    onClick={() => handleCancelOrder(viewOrder._id || viewOrder.id)}
                    className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-2xl hover:bg-red-200 transition text-sm"
                  >
                    🗑️ Cancel Order
                  </button>
                )}
                <button
                  onClick={() => setViewOrder(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 text-white ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
