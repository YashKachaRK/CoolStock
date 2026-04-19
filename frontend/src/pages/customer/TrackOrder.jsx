import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const statusConfig = {
  'Pending': { color: 'bg-orange-100 text-orange-700', icon: '⏳', steps: 0, desc: 'Your order is being reviewed.' },
  'Accepted': { color: 'bg-blue-100 text-blue-700', icon: '✅', steps: 1, desc: 'Order accepted by manager.' },
  'Assigned': { color: 'bg-indigo-100 text-indigo-700', icon: '🛵', steps: 2, desc: 'Delivery boy assigned.' },
  'Delivered': { color: 'bg-teal-100 text-teal-700', icon: '📦', steps: 3, desc: 'Order delivered to shop.' },
  'Paid': { color: 'bg-green-100 text-green-700', icon: '💰', steps: 4, desc: 'Payment received & completed.' }
};

const allSteps = ['Order Placed', 'Accepted', 'Assigned', 'Delivered', 'Paid'];

export default function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceModal, setInvoiceModal] = useState(null);

  const API = "http://localhost:5000";

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get(`${API}/myOrders`);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching my orders:", err);
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const viewInvoice = (order) => {
    setInvoiceModal({
      ...order,
      invoiceId: 'INV-' + order.order_number.replace('ORD-', ''),
      invDate: new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading order history...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white p-8 rounded-[2rem] mb-10 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">📍 Order History</h1>
          <p className="opacity-80 mt-1">Track your bulk orders and download invoices.</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl text-center hidden sm:block">
          <p className="text-[10px] uppercase font-black opacity-70">Total Orders</p>
          <p className="text-2xl font-black">{orders.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-700">No Orders Found</h2>
            <p className="text-gray-400 mt-2 mb-8">You haven't placed any bulk orders yet.</p>
            <Link
              to="/customer/place_order"
              className="px-10 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition shadow-lg shadow-purple-100"
            >
              Shop Ice Cream
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig['Pending'];
            const stepsDone = cfg.steps;

            return (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-6 md:p-8">
                  {/* Order Top Info */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-2xl text-gray-800">{order.order_number}</span>
                        <span className={`${cfg.color} px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}>
                          {cfg.icon} {order.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                        <span>📅 {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        <span className="text-gray-200">•</span>
                        <span className="text-purple-600 font-bold uppercase text-[10px]">{order.urgency} Delivery</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Amount</p>
                      <p className="font-black text-3xl text-purple-700">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Order Items</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{order.items_summary || "Order detail summary pending..."}</p>
                  </div>

                  {/* Progress Tracks */}
                  <div className="relative pt-2 px-2 mb-10">
                    {/* Background Line */}
                    <div className="absolute top-6 left-8 right-8 h-1 bg-gray-100 -z-0"></div>
                    {/* Active Line */}
                    <div
                      className="absolute top-6 left-8 h-1 bg-purple-600 transition-all duration-1000 -z-0"
                      style={{ width: `${(stepsDone / (allSteps.length - 1)) * 90}%` }}
                    ></div>

                    <div className="flex justify-between relative z-10 text-center">
                      {allSteps.map((step, i) => {
                        const isDone = i <= stepsDone;
                        const isCurrent = i === stepsDone;

                        return (
                          <div key={i} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all shadow-sm ${isDone ? 'bg-purple-600 text-white' : 'bg-white border-2 border-gray-100 text-gray-300'
                              } ${isCurrent ? 'ring-4 ring-purple-100 scale-110' : ''}`}>
                              {isDone ? '✓' : (i + 1)}
                            </div>
                            <span className={`mt-3 text-[10px] font-black uppercase tracking-wider ${isDone ? 'text-purple-700' : 'text-gray-300'
                              }`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-50">
                    {order.status === 'Paid' ? (
                      <button
                        onClick={() => viewInvoice(order)}
                        className="flex-1 py-4 bg-emerald-600/10 text-emerald-700 font-black rounded-2xl hover:bg-emerald-600/20 transition flex items-center justify-center gap-2"
                      >
                        📄 Download Invoice
                      </button>
                    ) : (
                      <div className="flex-1 py-4 px-6 bg-gray-50 text-gray-400 text-xs font-bold rounded-2xl flex items-center justify-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                        Status: {cfg.desc}
                      </div>
                    )}
                    <button className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition text-sm">
                      Need Help?
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal (Keep similar but with better styling) */}
      {invoiceModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden print:shadow-none print:w-full">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-10 flex justify-between items-center print:text-black">
              <div>
                <h1 className="text-3xl font-black">🍦 CoolStock</h1>
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mt-1">Official Invoice</p>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl">{invoiceModal.invoiceId}</p>
                <p className="text-xs font-bold opacity-70">{invoiceModal.invDate}</p>
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Customer Details</p>
                  <p className="font-black text-xl text-gray-800">{invoiceModal.customer_name || invoiceModal.shop}</p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{invoiceModal.customer_addr || invoiceModal.addr}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Order Info</p>
                  <p className="text-sm font-bold text-gray-700">Order ID: {invoiceModal.order_number}</p>
                  <p className="text-sm font-bold text-gray-700 mt-1">Status: <span className="text-green-600 font-black">PAID ✅</span></p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2rem] p-6 mb-8 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Summary of Items</p>
                <p className="text-sm text-gray-700 font-bold leading-relaxed">{invoiceModal.items_summary}</p>
              </div>

              <div className="bg-emerald-50 rounded-[2rem] p-7 flex justify-between items-center mb-10 border border-emerald-100">
                <span className="font-black text-emerald-800 uppercase text-xs tracking-widest">Amount Paid</span>
                <span className="text-4xl font-black text-emerald-700">₹{Number(invoiceModal.amount).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                >
                  🖨️ Print Invoice
                </button>
                <button
                  onClick={() => setInvoiceModal(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-300 font-bold uppercase mt-6 tracking-widest print:hidden">Generated by CoolStock OMS</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
