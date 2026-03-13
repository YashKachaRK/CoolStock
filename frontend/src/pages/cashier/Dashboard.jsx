import { useState, useEffect } from 'react';

export default function CashierDashboard() {
  const [time, setTime] = useState(new Date());
  
  const [pendingVerifications, setPendingVerifications] = useState([
    { id: '295', customer: 'Patel Kirana Shop', location: 'Anklav, Anand', items: 'Strawberry Cup × 10 cartons', deliveryBoy: 'Neha Singh', amount: '6,000' },
    { id: '293', customer: 'Sharma Cold Store', location: 'Borsad, Anand', items: 'Chocolate Cone × 8, Mango Shake × 3 cartons', deliveryBoy: 'Rohit Das', amount: '8,640' }
  ]);
  
  const [verifiedPayments, setVerifiedPayments] = useState([
    { id: '290', customer: 'Joshi Provisions', amount: '5,760' }
  ]);
  
  const [invoice, setInvoice] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const verifyPayment = (payment) => {
    setPendingVerifications(pendingVerifications.filter(p => p.id !== payment.id));
    setVerifiedPayments([{ ...payment }, ...verifiedPayments]);
    showToast(`✅ Payment verified! Invoice generated for ${payment.customer}`);
    printInvoice(payment);
  };

  const printInvoice = (payment) => {
    setInvoice({
      ...payment,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const closeInvoice = () => {
    setInvoice(null);
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg print:hidden">
        <div>
          <h1 className="text-xl md:text-3xl font-black">💳 Cashier — Payment Verification</h1>
          <p className="opacity-80 mt-1 text-sm">Verify cash received from Delivery Boy &amp; generate invoice</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs md:text-sm opacity-70 hidden sm:block">{formattedDate}</div>
          <div className="text-lg md:text-2xl font-bold mt-1">{formattedTime}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 print:hidden">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Pending Verifications</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{pendingVerifications.length}</p>
          <p className="text-orange-400 text-xs mt-1">Cash received, needs approval</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Verified Today</p>
          <p className="text-3xl font-black text-green-600 mt-2">{verifiedPayments.length + 2}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Cash Collected Today</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">₹22,560</p>
        </div>
      </div>

      {/* PENDING PAYMENT VERIFICATIONS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 print:hidden">
        <div className="flex justify-between items-center p-6 border-b bg-orange-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">⏳ Awaiting Payment Verification</h2>
            <p className="text-gray-400 text-sm mt-0.5">Delivery Boy has deposited cash — verify and generate invoice</p>
          </div>
          <span className="bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">{pendingVerifications.length} Pending</span>
        </div>
        <div className="p-6 space-y-4">
          
          {pendingVerifications.map(payment => (
            <div key={payment.id} className="border-2 border-orange-200 rounded-2xl p-6 bg-orange-50">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-black text-xl text-gray-800">#ORD-{payment.id}</span>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">Cash Received — Verify</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">🏪 <strong>{payment.customer}</strong> — {payment.location || ''}</p>
                  <p className="text-sm text-gray-500 mb-1">📦 {payment.items || 'Ice Cream Products'}</p>
                  <p className="text-sm text-gray-500 mb-1">🛵 Delivered by: <strong>{payment.deliveryBoy || 'Delivery Staff'}</strong></p>
                  <p className="text-xl font-black text-emerald-600 mt-2">💵 Cash Received: ₹{payment.amount}</p>
                </div>
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <button 
                    onClick={() => verifyPayment(payment)}
                    className="bg-emerald-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-emerald-700 transition text-sm"
                  >
                    ✅ Verify & Generate Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}

          {pendingVerifications.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <div className="text-5xl mb-3">🎉</div>
              <p className="font-semibold text-lg">All payments verified for today!</p>
            </div>
          )}

        </div>
      </div>

      {/* VERIFIED PAYMENTS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">✅ Verified Payments — Invoices Generated</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="px-6 text-left">Customer</th>
                <th className="px-6 text-left">Amount</th>
                <th className="px-6 text-left">Status</th>
                <th className="px-6 text-left">Invoice</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {verifiedPayments.map((payment, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-bold">#ORD-{payment.id}</td>
                  <td className="px-6">{payment.customer}</td>
                  <td className="px-6 font-bold text-emerald-600">₹{payment.amount}</td>
                  <td className="px-6"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">PAID ✅</span></td>
                  <td className="px-6">
                    <button 
                      onClick={() => printInvoice(payment)}
                      className="text-blue-600 hover:underline text-xs font-semibold"
                    >
                      🖨️ Print Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE MODAL */}
      {invoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 print:bg-transparent print:relative print:flex-col print:items-start print:p-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-0 overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-8 flex justify-between items-center print:bg-none print:text-black print:border-b-2 print:border-black">
              <div>
                <h1 className="text-3xl font-black">🍦 CoolStock</h1>
                <p className="text-sm opacity-80 mt-1 print:text-gray-600">Ice Cream Wholesale — Official Invoice</p>
              </div>
              <div className="text-right text-sm opacity-80 print:text-black">
                <p className="font-bold text-xl">INV-{invoice.id}</p>
                <p>{invoice.date}</p>
              </div>
            </div>
            {/* Invoice Body */}
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Billed To</p>
                  <p className="font-black text-gray-800 text-lg">{invoice.customer}</p>
                  <p className="text-gray-500 text-sm">{invoice.location || 'Retail Customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Payment Status</p>
                  <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-black text-sm print:bg-white print:border print:border-green-600">PAID ✅</span>
                </div>
              </div>
              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b-2 text-gray-400 uppercase text-xs">
                    <th className="pb-3 text-left">Description</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 text-gray-700">{invoice.items || 'Wholesale Ice Cream Products'}</td>
                    <td className="py-3 text-right font-black text-gray-800">₹{invoice.amount}</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-emerald-50 rounded-2xl p-4 flex justify-between items-center mb-6 print:bg-transparent print:border print:border-gray-200">
                <span className="font-bold text-gray-700 text-lg">Total Paid</span>
                <span className="text-3xl font-black text-emerald-700">₹{invoice.amount}</span>
              </div>
              <div className="flex gap-3 print:hidden">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition"
                >
                  🖨️ Print Invoice
                </button>
                <button 
                  onClick={closeInvoice}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
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
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all print:hidden">
          {toast.message}
        </div>
      )}
    </div>
  );
}
