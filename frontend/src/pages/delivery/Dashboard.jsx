import { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROXY = "http://localhost:5000";

const statusConfig = {
  'Assigned':   { color: 'bg-orange-100 text-orange-700', icon: '⏳', next: 'In Transit', btn: '🚀 Dispatch Order' },
  'In Transit': { color: 'bg-blue-100 text-blue-700',    icon: '🛵', next: 'Deposited',  btn: '✅ Mark Delivered & Deposit' },
  'Deposited':  { color: 'bg-green-100 text-green-700',  icon: '💰', next: null,          btn: null },
  'Paid':       { color: 'bg-emerald-100 text-emerald-700', icon: '✅', next: null,       btn: null },
};

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders]       = useState([]);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [user, setUser]           = useState(null);
  const [toast, setToast]         = useState({ show: false, message: '', type: 'success' });

  // Cashier deposit modal
  const [depositModal, setDepositModal] = useState(null); // order object
  const [cashiers, setCashiers]         = useState([]);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [depositing, setDepositing]     = useState(false);

  // Info modal
  const [infoModal, setInfoModal] = useState(null); // order object

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchData(userData.id);
    fetchCashiers();
  }, []);

  const fetchData = async (deliveryBoyId) => {
    setLoading(true);
    try {
      const id = deliveryBoyId || JSON.parse(localStorage.getItem('user') || '{}').id;
      const [assignedRes, historyRes] = await Promise.all([
        axios.get(`${API_PROXY}/orders/assigned`, { params: { delivery_boy_id: id } }),
        axios.get(`${API_PROXY}/orders/history`,  { params: { delivery_boy_id: id } }),
      ]);
      setOrders(assignedRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error('Error fetching delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCashiers = async () => {
    try {
      const res = await axios.get(`${API_PROXY}/staff`);
      const activeCashiers = (res.data || []).filter(
        s => s.role === 'Cashier' && s.status === 'Active'
      );
      setCashiers(activeCashiers);
    } catch (err) {
      console.error('Error fetching cashiers:', err);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const deliveryUser = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      if (newStatus === 'In Transit') {
        await axios.put(`${API_PROXY}/orders/dispatch/${orderId}`, {
          delivery_boy_id:   deliveryUser.id,
          delivery_boy_name: deliveryUser.name,
        });
        showToast('Order dispatched — In Transit!', 'success');
        fetchData(deliveryUser.id);
      } else if (newStatus === 'Deposited') {
        // Open cashier selection modal instead of directly depositing
        const order = orders.find(o => o.id === orderId || String(o._id) === String(orderId));
        setSelectedCashier('');
        setDepositModal(order);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  const confirmDeposit = async () => {
    if (!selectedCashier) {
      showToast('⚠️ Please select a cashier first!', 'error');
      return;
    }
    const deliveryUser = JSON.parse(localStorage.getItem('user') || '{}');
    setDepositing(true);
    try {
      await axios.put(`${API_PROXY}/orders/delivered/${depositModal.id}`, {
        delivery_boy_id:   deliveryUser.id,
        delivery_boy_name: deliveryUser.name,
        cashier_id:        selectedCashier,
      });
      showToast('✅ Cash handed over to cashier!', 'success');
      setDepositModal(null);
      setSelectedCashier('');
      fetchData(deliveryUser.id);
      setActiveTab('history');
    } catch (err) {
      console.error('Error depositing cash:', err);
      showToast('Failed to deposit cash', 'error');
    } finally {
      setDepositing(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading your deliveries...</div>;

  const activeOrders  = orders.filter(o => o.status === 'Assigned' || o.status === 'In Transit');
  const depositOrders = orders.filter(o => o.status === 'Deposited');

  return (
    <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 md:p-10 rounded-[2rem] mb-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center text-5xl backdrop-blur-sm border-2 border-white/30">🛵</div>
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
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">Pending Cash</p>
            <p className="text-2xl font-black">₹{depositOrders.reduce((s, o) => s + Number(o.amount), 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 bg-gray-100 p-2 rounded-[1.5rem] w-fit">
        {[
          { key: 'active',  label: '🚀 Active Queue',    count: activeOrders.length,  activeColor: 'text-indigo-600' },
          { key: 'deposit', label: '💰 Deposit Cash',    count: depositOrders.length, activeColor: 'text-emerald-600' },
          { key: 'history', label: '📅 Previous Orders', count: null,                 activeColor: 'text-gray-600' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.key ? `bg-white ${tab.activeColor} shadow-md scale-105` : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
            {tab.count !== null && <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg ml-1">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">

        {/* Active Queue */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-dashed border-gray-200">
                <div className="text-7xl mb-6">🏜️</div>
                <h2 className="text-2xl font-black text-gray-800">Queue is Empty!</h2>
                <p className="text-gray-400 mt-2">No active deliveries assigned to you right now.</p>
              </div>
            ) : activeOrders.map(order => {
              const cfg = statusConfig[order.status];
              return (
                <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-2xl text-gray-800">{order.order_number}</span>
                        <span className={`${cfg.color} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>{cfg.icon} {order.status}</span>
                        {order.urgency === 'Urgent' && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">⚡ Urgent</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Shop / Customer</p>
                          <p className="font-bold text-gray-800">{order.customer_name}</p>
                          <p className="text-[11px] text-gray-500 mt-1">{order.customer_addr}</p>
                          <p className="text-[11px] text-gray-500">{order.customer_phone}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Items Summary</p>
                          <p className="text-[11px] text-gray-700 leading-relaxed italic">"{order.items_summary || 'No items listed'}"</p>
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
              );
            })}
          </div>
        )}

        {/* Deposit Cash */}
        {activeTab === 'deposit' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-8 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg">💵</div>
                <div>
                  <h2 className="text-xl font-black text-emerald-800 tracking-tight">Deposit Outstanding Cash</h2>
                  <p className="text-emerald-600 text-sm font-medium">Select the cashier you are handing cash over to.</p>
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
            ) : depositOrders.map(order => (
              <div key={order.id} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-800">{order.order_number}</span>
                    <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic">Delivered</span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase">{order.customer_name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">📅 {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount to Handover</p>
                  <p className="text-2xl font-black text-emerald-600">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => handleStatusChange(order.id, 'Deposited')}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-700 transition text-xs uppercase tracking-widest shadow-xl shadow-emerald-100"
                >
                  Hand Over to Cashier 🏦
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Previous Orders / History */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 font-black uppercase tracking-widest">No history found.</div>
            )}
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
                <div className="flex flex-col items-end gap-2">
                  <p className="font-black text-lg text-emerald-600">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase">Settled</p>
                  <button
                    onClick={() => setInfoModal(order)}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 transition"
                  >
                    ℹ️ Info
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Cashier Selection Modal ────────────────────────────────── */}
      {depositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">🏦</div>
              <div>
                <h2 className="text-xl font-black text-gray-800">Deposit Cash</h2>
                <p className="text-sm text-gray-400 font-medium">Select the cashier you're handing money to</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order</p>
                  <p className="font-black text-gray-800">{depositModal.order_number}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{depositModal.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-2xl font-black text-emerald-600">₹{Number(depositModal.amount).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Cashier Selector */}
            <div className="mb-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Select Cashier
              </label>
              {cashiers.length === 0 ? (
                <p className="text-sm text-red-500 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
                  ⚠️ No active cashiers found. Please contact the manager.
                </p>
              ) : (
                <div className="space-y-2">
                  {cashiers.map(c => {
                    const cid = String(c._id || c.id);
                    return (
                      <label
                        key={cid}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${selectedCashier === cid ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                      >
                        <input
                          type="radio"
                          name="cashier"
                          value={cid}
                          checked={selectedCashier === cid}
                          onChange={() => setSelectedCashier(cid)}
                          className="accent-emerald-600"
                        />
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-black text-emerald-700 shrink-0">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{c.name}</p>
                          <p className="text-[10px] text-gray-400">{c.email}</p>
                        </div>
                        {selectedCashier === cid && <span className="ml-auto text-emerald-500 text-lg">✔</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setDepositModal(null); setSelectedCashier(''); }}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-black text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeposit}
                disabled={depositing || !selectedCashier || cashiers.length === 0}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {depositing ? '⏳ Processing...' : '✅ Confirm Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Info Modal ───────────────────────────────────────── */}
      {infoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-black text-gray-800">Order Details</h2>
                <p className="text-sm text-indigo-600 font-bold mt-0.5">{infoModal.order_number}</p>
              </div>
              <button
                onClick={() => setInfoModal(null)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition font-black"
              >✕</button>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className={`${statusConfig[infoModal.status]?.color || 'bg-gray-100 text-gray-600'} px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest`}>
                {statusConfig[infoModal.status]?.icon} {infoModal.status}
              </span>
              {infoModal.urgency === 'Urgent' && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase">⚡ Urgent</span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Customer / Shop</p>
                <p className="font-bold text-gray-800">{infoModal.customer_name}</p>
                {infoModal.customer_addr && <p className="text-xs text-gray-500 mt-1">{infoModal.customer_addr}</p>}
                {infoModal.customer_phone && <p className="text-xs text-gray-500">📞 {infoModal.customer_phone}</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Amount Collected</p>
                <p className="text-2xl font-black text-emerald-600">₹{Number(infoModal.amount).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order Placed On</p>
                <p className="font-bold text-gray-800">{new Date(infoModal.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Assigned By</p>
                <p className="font-bold text-gray-800">{infoModal.assigned_by_name || '—'}</p>
              </div>
              {infoModal.payment_collected_by_name && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 sm:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Cash Deposited To</p>
                  <p className="font-bold text-gray-800">🏦 {infoModal.payment_collected_by_name}</p>
                </div>
              )}
            </div>

            {/* Items */}
            {infoModal.items_summary && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Items Delivered</p>
                <p className="text-sm text-gray-700 leading-relaxed">{infoModal.items_summary}</p>
              </div>
            )}

            <button
              onClick={() => setInfoModal(null)}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-8 py-5 rounded-2xl shadow-2xl font-black z-50 transition-all animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
