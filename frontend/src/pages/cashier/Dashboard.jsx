import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function CashierDashboard() {
  const [time, setTime] = useState(new Date());
  const [pendingPayments, setPendingPayments] = useState([]);
  const [verifiedPayments, setVerifiedPayments] = useState([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingVerified, setLoadingVerified] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', ok: true });
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'

  const cashier = JSON.parse(localStorage.getItem('user') || '{}');

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch pending payments (status: Deposited)
  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const res = await axios.get(`${API}/orders/pending-payments`);
      setPendingPayments(res.data);
    } catch {
      showToast('❌ Failed to load pending payments', false);
    } finally {
      setLoadingPending(false);
    }
  };

  // Fetch verified payments (status: Paid) — filtered to this cashier
  const fetchVerified = async () => {
    try {
      setLoadingVerified(true);
      const params = cashier?.id ? { cashier_id: cashier.id } : {};
      const res = await axios.get(`${API}/orders/verified-payments`, { params });
      setVerifiedPayments(res.data);
    } catch {
      showToast('❌ Failed to load payment history', false);
    } finally {
      setLoadingVerified(false);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchVerified();
  }, []);

  const showToast = (message, ok = true) => {
    setToast({ show: true, message, ok });
    setTimeout(() => setToast({ show: false, message: '', ok: true }), 3500);
  };

  // Verify payment → backend PUT → move to Paid
  const handleVerify = async (order) => {
    setVerifyingId(order._id || order.id);
    try {
      await axios.put(`${API}/orders/verify-payment/${order._id || order.id}`, {
        cashier_id: cashier?.id || null,
        cashier_name: cashier?.name || 'Cashier',
      });
      showToast(`✅ Payment verified for ${order.customer_name}!`, true);
      // Show invoice immediately
      openInvoice(order);
      // Refresh both lists
      await fetchPending();
      await fetchVerified();
    } catch {
      showToast('❌ Failed to verify payment', false);
    } finally {
      setVerifyingId(null);
    }
  };

  const openInvoice = (order) => {
    setInvoice({
      ...order,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
  };

  // Derived stats
  const todayStr = new Date().toDateString();
  const verifiedToday = verifiedPayments.filter(o => new Date(o.paid_at).toDateString() === todayStr);
  const cashToday = verifiedToday.reduce((s, o) => s + Number(o.amount || 0), 0);

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-4 md:p-8 w-full">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg print:hidden">
        <div>
          <h1 className="text-xl md:text-3xl font-black">💳 Cashier — Payment Verification</h1>
          <p className="opacity-80 mt-1 text-sm">Verify cash deposited by Delivery Boy &amp; generate invoice</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs md:text-sm opacity-70 hidden sm:block">{formattedDate}</div>
          <div className="text-lg md:text-2xl font-bold mt-1 font-mono">{formattedTime}</div>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 print:hidden">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer" onClick={() => setActiveTab('pending')}>
          <p className="text-gray-400 text-sm">Pending Verifications</p>
          <p className="text-4xl font-black text-orange-500 mt-2">{loadingPending ? '…' : pendingPayments.length}</p>
          <p className="text-orange-400 text-xs mt-1">Cash received, needs approval</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer" onClick={() => setActiveTab('history')}>
          <p className="text-gray-400 text-sm">Verified Today</p>
          <p className="text-4xl font-black text-green-600 mt-2">{loadingVerified ? '…' : verifiedToday.length}</p>
          <p className="text-green-400 text-xs mt-1">Invoices generated</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Cash Collected Today</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">₹{cashToday.toLocaleString('en-IN')}</p>
          <p className="text-gray-400 text-xs mt-1">From verified orders</p>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-3 mb-6 print:hidden">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'pending' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
        >
          ⏳ Pending ({loadingPending ? '…' : pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === 'history' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'}`}
        >
          ✅ Payment History ({loadingVerified ? '…' : verifiedPayments.length})
        </button>
      </div>

      {/* ── PENDING PAYMENT VERIFICATIONS ── */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 print:hidden">
          <div className="flex justify-between items-center p-6 border-b bg-orange-50">
            <div>
              <h2 className="text-xl font-bold text-gray-800">⏳ Awaiting Payment Verification</h2>
              <p className="text-gray-400 text-sm mt-0.5">Delivery Boy has deposited cash — verify and generate invoice</p>
            </div>
            <span className="bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
              {pendingPayments.length} Pending
            </span>
          </div>

          <div className="p-6 space-y-4">
            {loadingPending ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-4 animate-bounce">💳</div>
                <p className="text-gray-400 font-semibold">Loading pending payments...</p>
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-semibold text-lg">All payments verified for today!</p>
                <p className="text-sm mt-1">No cash deposits awaiting verification.</p>
              </div>
            ) : (
              pendingPayments.map(order => (
                <div key={order._id || order.id} className="border-2 border-orange-200 rounded-2xl p-6 bg-orange-50 hover:border-orange-400 transition">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-black text-xl text-gray-800">{order.order_number}</span>
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">Cash Received — Verify</span>
                        {order.urgency === 'Urgent' && (
                          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">🔴 Urgent</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        🏪 <strong>{order.customer_name || '—'}</strong>
                        {order.customer_addr && <span className="text-gray-400"> — {order.customer_addr}</span>}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">📦 {order.items_summary || 'Ice Cream Products'}</p>
                      {order.delivery_boy_name && (
                        <p className="text-sm text-gray-500 mb-1">🛵 Delivered by: <strong>{order.delivery_boy_name}</strong></p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        📅 Deposited: {order.deposited_at ? new Date(order.deposited_at).toLocaleString('en-IN') : 'Recently'}
                      </p>
                      <p className="text-2xl font-black text-emerald-600 mt-3">
                        💵 ₹{Number(order.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <button
                        disabled={verifyingId === (order._id || order.id)}
                        onClick={() => handleVerify(order)}
                        className="bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-emerald-700 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {verifyingId === (order._id || order.id) ? (
                          <><span className="animate-spin">⏳</span> Verifying...</>
                        ) : (
                          '✅ Verify & Invoice'
                        )}
                      </button>
                      <button
                        onClick={() => openInvoice(order)}
                        className="bg-blue-50 text-blue-700 py-2 px-4 rounded-xl font-semibold text-xs hover:bg-blue-100 transition border border-blue-200"
                      >
                        👁 Preview Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── PAYMENT HISTORY ── */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">✅ Verified Payments — History</h2>
              <p className="text-gray-400 text-sm mt-0.5">All payments verified by you — click to re-print invoice</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full">
              {verifiedPayments.length} Records
            </span>
          </div>
          <div className="overflow-x-auto">
            {loadingVerified ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-4 animate-bounce">📋</div>
                <p className="text-gray-400 font-semibold">Loading history...</p>
              </div>
            ) : verifiedPayments.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <div className="text-5xl mb-3">📂</div>
                <p className="font-semibold">No verified payments found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="px-6 text-left">Customer</th>
                    <th className="px-6 text-left">Items</th>
                    <th className="px-6 text-left">Amount</th>
                    <th className="px-6 text-left">Verified On</th>
                    <th className="px-6 text-left">Status</th>
                    <th className="px-6 text-left">Invoice</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {verifiedPayments.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-6 font-bold text-gray-800">{order.order_number}</td>
                      <td className="px-6">
                        <p className="font-semibold">{order.customer_name || '—'}</p>
                        <p className="text-xs text-gray-400">{order.customer_addr || ''}</p>
                      </td>
                      <td className="px-6 text-xs text-gray-500 max-w-[180px] truncate">{order.items_summary || '—'}</td>
                      <td className="px-6 font-bold text-emerald-700">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                      <td className="px-6 text-gray-400 text-xs">
                        {order.paid_at ? new Date(order.paid_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-6">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">PAID ✅</span>
                      </td>
                      <td className="px-6">
                        <button
                          onClick={() => openInvoice(order)}
                          className="text-blue-600 hover:underline text-xs font-semibold hover:text-blue-800 transition"
                        >
                          🖨️ Print Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── INVOICE MODAL ── */}
      {invoice && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:bg-transparent print:relative print:flex-col print:items-start print:p-0"
          onClick={(e) => { if (e.target === e.currentTarget) setInvoice(null); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 flex justify-between items-start print:bg-none print:text-black print:border-b-2 print:border-black">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">🍦</span>
                  <h1 className="text-3xl font-black">CoolStock</h1>
                </div>
                <p className="text-sm opacity-80 print:text-gray-600">Ice Cream Wholesale Distribution — Official Tax Invoice</p>
              </div>
              <div className="text-right text-sm opacity-90 print:text-black">
                <p className="font-black text-xl">INV-{invoice.order_number}</p>
                <p className="mt-0.5">{invoice.invoiceDate || new Date(invoice.paid_at).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-8">
              {/* Billed To + Payment Status */}
              <div className="flex justify-between mb-6 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-widest">Billed To</p>
                  <p className="font-black text-gray-800 text-xl">{invoice.customer_name || '—'}</p>
                  {invoice.customer_addr && <p className="text-gray-500 text-sm mt-0.5">📍 {invoice.customer_addr}</p>}
                  {invoice.customer_phone && <p className="text-gray-500 text-sm">📞 {invoice.customer_phone}</p>}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black mb-1 tracking-widest">Payment Status</p>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-sm print:bg-white print:border print:border-green-600">
                    PAID ✅
                  </span>
                  {invoice.delivery_boy_name && (
                    <p className="text-xs text-gray-400 mt-2">🛵 Delivered by: {invoice.delivery_boy_name}</p>
                  )}
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5 print:border print:border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase font-black mb-3 tracking-widest">Items Ordered</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-400 uppercase text-xs">
                      <th className="pb-2 text-left">Description</th>
                      <th className="pb-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 text-gray-700">{invoice.items_summary || 'Wholesale Ice Cream Products'}</td>
                      <td className="py-3 text-right font-black text-gray-800">₹{Number(invoice.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="bg-emerald-50 rounded-2xl p-5 flex justify-between items-center mb-6 print:bg-transparent print:border print:border-gray-200">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total Amount Paid</p>
                  <p className="text-xs text-gray-400 mt-0.5">Cash payment received</p>
                </div>
                <span className="text-4xl font-black text-emerald-700">₹{Number(invoice.amount).toLocaleString('en-IN')}</span>
              </div>

              {/* Cashier name */}
              <p className="text-xs text-gray-300 text-center mb-4">
                Verified by: {cashier?.name || 'Cashier'} &nbsp;|&nbsp; {new Date().toLocaleString('en-IN')}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition shadow-lg"
                >
                  🖨️ Print Invoice
                </button>
                <button
                  onClick={() => setInvoice(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all print:hidden ${toast.ok ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
