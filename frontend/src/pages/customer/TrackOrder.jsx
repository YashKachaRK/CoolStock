import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const statusConfig = {
  'Pending': { color: 'bg-orange-100 text-orange-700', icon: '⏳', steps: 0 },
  'Assigned': { color: 'bg-blue-100 text-blue-700', icon: '📌', steps: 1 },
  'In Transit': { color: 'bg-indigo-100 text-indigo-700', icon: '🛵', steps: 2 },
  'Delivered': { color: 'bg-teal-100 text-teal-700', icon: '📦', steps: 3 },
  'Paid': { color: 'bg-green-100 text-green-700', icon: '✅', steps: 4 }
};

const allSteps = ['Order Placed', 'Assigned to Delivery', 'Out for Delivery', 'Delivered', 'Payment Received'];

export default function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const [invoiceModal, setInvoiceModal] = useState(null);

  useEffect(() => {
    let storedOrders = JSON.parse(localStorage.getItem('cs_orders') || '[]');
    if (!storedOrders.length) {
      storedOrders = [
        { id: '#ORD-290', shop: 'Joshi Provisions', addr: 'Nadiad, Kheda', items: 'Vanilla Cone × 8 cartons', amount: 5760, status: 'Paid', date: '10/3/2026 9:00 AM' },
        { id: '#ORD-285', shop: 'My Shop', addr: 'Village, Dist.', items: 'Chocolate Cone × 5 cartons', amount: 3600, status: 'In Transit', date: '10/3/2026 8:00 AM' },
      ];
    }
    setOrders(storedOrders);
  }, []);

  const viewInvoice = (order) => {
    setInvoiceModal({
      ...order,
      invoiceId: 'INV-' + order.id.replace('#', ''),
      invDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-7 rounded-2xl mb-8 shadow-lg">
        <h1 className="text-3xl font-black">📍 Track My Orders</h1>
        <p className="opacity-80 mt-1">Live status of all your bulk orders. Download invoice after payment.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-7xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-400 mb-6">Place your first bulk order for your shop.</p>
            <Link 
              to="/customer/place_order"
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition inline-block"
            >
              Place Bulk Order
            </Link>
          </div>
        ) : (
          orders.map((order, idx) => {
            const cfg = statusConfig[order.status] || statusConfig['Pending'];
            const stepsDone = cfg.steps;

            return (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-black text-xl text-gray-800">{order.id}</span>
                    <span className={`${cfg.color} ml-2 px-3 py-0.5 rounded-full text-xs font-bold`}>{cfg.icon} {order.status}</span>
                    <p className="text-gray-400 text-xs mt-1">📅 {order.date}</p>
                  </div>
                  <p className="font-black text-2xl text-purple-700">₹{Number(order.amount).toLocaleString('en-IN')}</p>
                </div>
                <p className="text-sm text-gray-600 mb-1">🏪 <strong>{order.shop}</strong> — {order.addr}</p>
                <p className="text-sm text-gray-500 mb-5">📦 {order.items}</p>
                
                <div className="flex w-full items-start mb-5">
                  {allSteps.map((step, i) => {
                    const circleBg = i <= stepsDone ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400';
                    const circleContent = i <= stepsDone ? '✓' : (i + 1);
                    const textClass = i <= stepsDone ? 'text-purple-700 font-semibold' : 'text-gray-400';
                    const hasLine = i < allSteps.length - 1;
                    const lineBg = i < stepsDone ? 'bg-purple-600' : 'bg-gray-200';

                    return (
                      <div key={i} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 z-10 ${circleBg}`}>
                          {circleContent}
                        </div>
                        <span className={`text-xs text-center leading-tight ${textClass}`} style={{ maxWidth: '60px' }}>{step}</span>
                        {hasLine && (
                          <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${lineBg}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {order.status === 'Paid' ? (
                  <button 
                    onClick={() => viewInvoice(order)}
                    className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition text-sm"
                  >
                    📄 Download Invoice
                  </button>
                ) : (
                  <p className="text-center text-xs text-gray-400 bg-gray-50 rounded-xl py-2">Invoice will be available after payment verification by Cashier</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal */}
      {invoiceModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden print:shadow-none print:w-full">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 flex justify-between items-center print:bg-none print:text-black">
              <div>
                <h1 className="text-3xl font-black">🍦 CoolStock</h1>
                <p className="text-sm opacity-80 mt-1">Official Invoice</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl print:text-black">{invoiceModal.invoiceId}</p>
                <p className="text-sm opacity-80 print:text-gray-600">{invoiceModal.invDate}</p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Billed To</p>
                  <p className="font-black text-lg text-gray-800">{invoiceModal.shop}</p>
                  <p className="text-gray-500 text-sm">{invoiceModal.addr}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Payment Status</p>
                  <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-black text-sm print:border print:border-gray-300">PAID ✅</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 print:bg-white print:border print:border-gray-200">
                <p className="text-sm text-gray-700">{invoiceModal.items}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 flex justify-between items-center mb-6 print:bg-white print:border print:border-gray-200">
                <span className="font-bold text-gray-700">Total Paid (COD)</span>
                <span className="text-3xl font-black text-emerald-700">₹{Number(invoiceModal.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition"
                >
                  🖨️ Download / Print
                </button>
                <button 
                  onClick={() => setInvoiceModal(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
