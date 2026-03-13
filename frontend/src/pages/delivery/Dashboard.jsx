import { useState, useEffect } from 'react';

export default function DeliveryDashboard() {
  const [time, setTime] = useState(new Date());
  
  const [assignedOrders, setAssignedOrders] = useState([
    { id: '301', customer: 'Ramesh General Store', location: 'Village Khari, Dist. Anand', items: 'Chocolate Cone × 5, Vanilla Cone × 3 cartons', total: '₹7,560', status: 'Assigned' }
  ]);
  
  const [transitOrders, setTransitOrders] = useState([
    { id: '298', customer: 'Mehta Traders', location: 'Nadiad, Kheda', items: 'Mango Shake × 7, Family Pack × 1 case', total: '₹9,200', status: 'In Transit' }
  ]);
  
  const [deliveredOrders, setDeliveredOrders] = useState([
    { id: '295', customer: 'Patel Kirana', location: 'Anklav, Anand', items: 'Strawberry Cup × 10 cartons', total: '₹6,000', status: 'Delivered' }
  ]);
  
  const [cashPending, setCashPending] = useState([]);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleStartDelivery = (order) => {
    setAssignedOrders(assignedOrders.filter(o => o.id !== order.id));
    setTransitOrders([{ ...order, status: 'In Transit' }, ...transitOrders]);
    showToast('🛵 Delivery started!', 'success');
  };

  const handleMarkDelivered = (order) => {
    setTransitOrders(transitOrders.filter(o => o.id !== order.id));
    setDeliveredOrders([{ ...order, status: 'Delivered' }, ...deliveredOrders]);
    setCashPending([{ ...order, amountStr: order.total }, ...cashPending]);
    showToast('✅ Order marked as Delivered! Deposit cash to Cashier.', 'success');
  };

  const handleDepositCash = (order) => {
    setCashPending(cashPending.filter(o => o.id !== order.id));
    showToast('💰 Cash deposited to Cashier! Invoice will be generated.', 'info');
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">🛵 Delivery Dashboard</h1>
          <p className="opacity-80 mt-1 text-sm">Your assigned orders for today</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs md:text-sm opacity-70 hidden sm:block">{formattedDate}</div>
          <div className="text-lg md:text-2xl font-bold mt-1">{formattedTime}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Assigned to Me</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{assignedOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Delivered</p>
          <p className="text-3xl font-black text-green-600 mt-2">{deliveredOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">In Transit</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{transitOrders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition border-2 border-red-200">
          <p className="text-red-500 text-sm font-semibold">Cash to Deposit</p>
          <p className="text-3xl font-black text-red-600 mt-2">{cashPending.length}</p>
          <p className="text-red-400 text-xs mt-1">Give to Cashier</p>
        </div>
      </div>

      {/* ASSIGNED ORDERS */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b bg-orange-50">
          <h2 className="text-xl font-bold text-gray-800">📋 My Assigned Orders</h2>
          <p className="text-gray-400 text-sm mt-0.5">Pick up, deliver, and mark each order complete</p>
        </div>
        <div className="p-6 space-y-4">
          
          {assignedOrders.map(order => (
            <div key={order.id} className="border-2 border-gray-100 rounded-2xl p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-lg text-gray-800">#ORD-{order.id}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">Assigned</span>
                  </div>
                  <p className="text-sm text-gray-600">🏪 <strong>{order.customer}</strong> — {order.location}</p>
                  <p className="text-sm text-gray-500 mt-1">📦 {order.items}</p>
                  <p className="text-sm font-bold text-indigo-600 mt-1">💰 Collect: {order.total} (Cash on Delivery)</p>
                </div>
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <button 
                    onClick={() => handleStartDelivery(order)}
                    className="bg-orange-500 text-white py-2 px-4 rounded-xl font-bold text-sm hover:bg-orange-600 transition"
                  >
                    🚀 Start Delivery
                  </button>
                </div>
              </div>
            </div>
          ))}

          {transitOrders.map(order => (
            <div key={order.id} className="border-2 border-blue-200 rounded-2xl p-5 bg-blue-50">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-lg text-gray-800">#ORD-{order.id}</span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">In Transit 🛵</span>
                  </div>
                  <p className="text-sm text-gray-600">🏪 <strong>{order.customer}</strong> — {order.location}</p>
                  <p className="text-sm text-gray-500 mt-1">📦 {order.items}</p>
                  <p className="text-sm font-bold text-indigo-600 mt-1">💰 Collect: {order.total} (Cash on Delivery)</p>
                </div>
                <div className="flex flex-col gap-2 min-w-[160px]">
                  <button 
                    onClick={() => handleMarkDelivered(order)}
                    className="bg-green-500 text-white py-2 px-4 rounded-xl font-bold text-sm hover:bg-green-600 transition"
                  >
                    ✅ Mark Delivered
                  </button>
                </div>
              </div>
            </div>
          ))}

          {deliveredOrders.map(order => (
            <div key={order.id} className="border-2 border-green-200 rounded-2xl p-5 bg-green-50">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-lg text-gray-800">#ORD-{order.id}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Delivered ✅</span>
                  </div>
                  <p className="text-sm text-gray-600">🏪 <strong>{order.customer}</strong> — {order.location}</p>
                  <p className="text-sm text-gray-500 mt-1">📦 {order.items}</p>
                  <p className="text-sm font-bold text-green-600 mt-1">💰 Collected: {order.total} — Deposit to Cashier</p>
                </div>
                <div className="min-w-[160px]">
                  <span className="text-green-600 font-semibold text-sm">Cash collected ✓</span>
                </div>
              </div>
            </div>
          ))}

          {assignedOrders.length === 0 && transitOrders.length === 0 && deliveredOrders.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold">No orders assigned for today.</p>
            </div>
          )}

        </div>
      </div>

      {/* PENDING CASH TO DEPOSIT */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-100">
        <div className="p-6 border-b bg-red-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-red-700">💰 Pending Cash to Deposit to Cashier</h2>
            <p className="text-gray-400 text-sm mt-0.5">Hand over all collected cash and click "Cash Deposited"</p>
          </div>
          <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">{cashPending.length} Pending</span>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {cashPending.map(c => (
              <div key={c.id} className="flex justify-between items-center bg-red-50 border border-red-200 rounded-xl p-4">
                <div>
                  <p className="font-bold text-gray-800">#ORD-{c.id}</p>
                  <p className="text-red-600 font-black text-lg">{c.amountStr} to deposit</p>
                </div>
                <button 
                  onClick={() => handleDepositCash(c)}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-red-600 transition text-sm"
                >
                  💵 Cash Deposited to Cashier
                </button>
              </div>
            ))}
          </div>
          
          {cashPending.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">💼</div>
              <p className="font-semibold">No cash pending. Deliver orders first!</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
