import { useState, useEffect } from 'react';
import axios from 'axios';

const API_PROXY = "http://localhost:5000";

export default function DeliveryDashboard() {
  const [time, setTime] = useState(new Date());
  
  // Storage for all orders bridged via LocalStorage
  const [allOrders, setAllOrders] = useState([]);
  
  // "Who am I" selector since Auth state isn't hooked up yet globally
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [activeDriver, setActiveDriver] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Fetch real staff for the logged-in dropdown impersonation
    axios.get(`${API_PROXY}/staff`).then(res => {
      const dbDeliveryBoys = (res.data || []).filter(s => s.role === 'Delivery');
      setDeliveryStaff(dbDeliveryBoys);
    }).catch(err => console.error("Error fetching staff:", err));

    // Hydrate orders mapped from Manager component
    loadOrders();
    
    return () => clearInterval(timer);
  }, []);

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('coolstock_orders');
    if (savedOrders) {
      setAllOrders(JSON.parse(savedOrders));
    }
  };

  const saveOrders = (updatedOrders) => {
    setAllOrders(updatedOrders);
    localStorage.setItem('coolstock_orders', JSON.stringify(updatedOrders));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updated = allOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveOrders(updated);
    
    if (newStatus === 'In Transit') showToast('🛵 Delivery started!', 'success');
    if (newStatus === 'Delivered') showToast('✅ Order marked as Delivered! Cash obtained.', 'success');
    if (newStatus === 'Cash Deposited') showToast('💰 Cash deposited to Cashier!', 'info');
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  // Active driver specific queues
  const myAssignedOrders = allOrders.filter(o => o.deliveryBoy === activeDriver && o.status === 'Assigned');
  const myTransitOrders = allOrders.filter(o => o.deliveryBoy === activeDriver && o.status === 'In Transit');
  const myDeliveredOrders = allOrders.filter(o => o.deliveryBoy === activeDriver && o.status === 'Delivered');
  const myCashDeposited = allOrders.filter(o => o.deliveryBoy === activeDriver && o.status === 'Cash Deposited');

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black">🛵 Delivery Dashboard</h1>
          <p className="opacity-90 mt-1 text-sm font-medium">Your assigned routes and pick-ups</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white/20 p-2 rounded-xl flex items-center gap-3">
             <span className="font-bold text-sm hidden md:block">Delivery Agent:</span>
             <select 
                value={activeDriver}
                onChange={e => setActiveDriver(e.target.value)}
                className="bg-white text-gray-800 font-bold px-3 py-1.5 rounded-lg text-sm w-full md:w-48 outline-none border-none shadow-sm"
             >
               <option value="">— Select Account —</option>
               {deliveryStaff.length > 0 ? (
                 deliveryStaff.map(s => <option key={s.id} value={s.name}>🦸‍♂️ {s.name}</option>)
               ) : (
                 <>
                   <option value="Neha Singh">🦸‍♂️ Neha Singh</option>
                   <option value="Rohit Das">🦸‍♂️ Rohit Das</option>
                   <option value="Arjun Mehta">🦸‍♂️ Arjun Mehta</option>
                 </>
               )}
             </select>
          </div>
          <div className="text-right shrink-0 hidden md:block">
            <div className="text-xs opacity-80">{formattedDate}</div>
            <div className="text-xl font-black mt-0.5">{formattedTime}</div>
          </div>
        </div>
      </div>

      {!activeDriver ? (
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
           <div className="text-6xl mb-4">🔐</div>
           <h2 className="text-2xl font-black text-gray-800">Please Select Your Account</h2>
           <p className="text-gray-500 mt-2">To view your assigned orders, select your name from the top right dropdown menu.</p>
           <button onClick={loadOrders} className="mt-6 font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition">↻ Force Sync with Manager</button>
        </div>
      ) : (
        <>
          {/* Stats flex */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition duration-300">
              <p className="text-gray-400 text-sm font-semibold">Ready to Pickup</p>
              <p className="text-3xl font-black text-orange-500 mt-2">{myAssignedOrders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition duration-300">
              <p className="text-gray-400 text-sm font-semibold">On The Road</p>
              <p className="text-3xl font-black text-blue-600 mt-2">{myTransitOrders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition duration-300">
              <p className="text-gray-400 text-sm font-semibold">Finished Today</p>
              <p className="text-3xl font-black text-green-600 mt-2">{myDeliveredOrders.length + myCashDeposited.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition duration-300 border-2 border-red-200 bg-red-50/20">
              <p className="text-red-500 text-sm font-bold">Pending Cash</p>
              <p className="text-3xl font-black text-red-600 mt-2">{myDeliveredOrders.length}</p>
              <p className="text-red-400 text-xs mt-1">Submit to cashier today</p>
            </div>
          </div>

          <div className="flex justify-start mb-4">
            <button 
              onClick={loadOrders}
              className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span>🔄</span> Refresh Assignments
            </button>
          </div>

          {/* ACTIVE QUEUE */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-black text-gray-800">📋 Action Queue</h2>
              <p className="text-gray-500 text-sm mt-0.5">Pick up goods from the manager, dispatch, and mark as delivered.</p>
            </div>
            <div className="p-6 space-y-4">
              
              {myAssignedOrders.map(order => (
                <div key={order.id} className="border-2 border-orange-100 rounded-2xl p-5 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg text-gray-800">#ORD-{order.id}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-gray-200">Waiting for Pickup</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">🏪 <strong>{order.customer}</strong> — {order.location}</p>
                      <p className="text-sm text-gray-500 mt-1">📦 <span className="font-medium text-gray-700">{order.items}</span></p>
                      <div className="mt-3 inline-block bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-lg">
                        💰 C.O.D: {order.total}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <button 
                        onClick={() => handleStatusChange(order.id, 'In Transit')}
                        className="w-full sm:w-auto bg-orange-500 text-white py-2.5 px-6 rounded-xl font-bold text-sm hover:bg-orange-600 transition shadow hover:-translate-y-0.5"
                      >
                        🚀 Dispatch Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {myTransitOrders.map(order => (
                <div key={order.id} className="border-2 border-blue-200 rounded-2xl p-5 bg-blue-50/30 hover:shadow-md transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-lg text-gray-800">#ORD-{order.id}</span>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ring-1 ring-blue-200">En Route 🛵</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">🏪 <strong>{order.customer}</strong> — {order.location}</p>
                      <p className="text-sm text-gray-500 mt-1">📦 <span className="font-medium text-gray-700">{order.items}</span></p>
                      <div className="mt-3 inline-block bg-blue-50/50 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg">
                        💰 Collect Amount: {order.total}
                      </div>
                    </div>
                    <div className="w-full sm:w-auto">
                      <button 
                        onClick={() => handleStatusChange(order.id, 'Delivered')}
                        className="w-full sm:w-auto bg-green-500 text-white py-2.5 px-6 rounded-xl font-bold text-sm hover:bg-green-600 transition shadow hover:-translate-y-0.5"
                      >
                        ✅ Give to Customer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {myAssignedOrders.length === 0 && myTransitOrders.length === 0 && (
                <div className="p-14 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                  <div className="text-6xl mb-4">🏖️</div>
                  <p className="font-black text-xl text-gray-500">Your queue is totally clear!</p>
                  <p className="text-sm mt-1">Wait for the manager to assign new pickups.</p>
                </div>
              )}
            </div>
          </div>

          {/* DEPOSIT TO CASHIER */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-black text-gray-800">💰 Settlement Queue</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {myDeliveredOrders.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-green-50 border border-green-200 rounded-xl p-4 transition hover:bg-green-100/50">
                      <div>
                        <p className="font-bold text-green-900">#ORD-{c.id}</p>
                        <p className="text-green-700 font-extrabold text-lg mt-0.5">{c.total} <span className="text-xs font-medium uppercase truncate tracking-wider">collected</span></p>
                      </div>
                      <button 
                        onClick={() => handleStatusChange(c.id, 'Cash Deposited')}
                        className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition text-sm shadow hover:shadow-lg"
                      >
                        Hand Over to Cashier 💵
                      </button>
                    </div>
                  ))}
                  
                  {myDeliveredOrders.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                      <div className="text-4xl mb-2 opacity-50">💸</div>
                      <p className="font-semibold text-sm">No cash strictly pending right now. Deliver some more orders first!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold z-50 transition-all ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-600' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
