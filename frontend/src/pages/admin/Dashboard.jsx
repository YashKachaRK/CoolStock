import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [requests, setRequests] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@example.com', role: 'Delivery Boy', applied: '10 Mar 2026', note: 'I have 2 years of delivery experience in the food industry. Available for day shifts.', bgUrl: 'bg-orange-100', color: 'text-blue-600' },
    { id: 2, name: 'Sunita Patel', phone: '+91 87654 32109', email: 'sunita@example.com', role: 'Cashier', applied: '9 Mar 2026', note: 'Commerce graduate with tally and billing experience. Looking for full-time work.', bgUrl: 'bg-blue-100', color: 'text-purple-600' },
    { id: 3, name: 'Vikram Shah', phone: '+91 76543 21098', email: 'vikram@example.com', role: 'Manager', applied: '8 Mar 2026', note: '5 years in wholesale distribution management. Can handle team coordination and order workflows.', bgUrl: 'bg-green-100', color: 'text-indigo-600' }
  ]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleApprove = (id, name) => {
    setRequests(requests.filter(req => req.id !== id));
    showToast(`✅ ${name} has been approved and added to the system!`, 'success');
  };

  const handleReject = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    showToast('❌ Application rejected.', 'error');
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-700 text-white p-7 rounded-2xl mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-black">⚙️ Admin Control Panel</h1>
          <p className="opacity-80 mt-1">CoolStock — Ice Cream Wholesale System</p>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-70">{formattedDate}</div>
          <div className="text-2xl font-bold mt-1">{formattedTime}</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Customers</p>
          <p className="text-3xl font-black text-slate-700 mt-2">24</p>
          <p className="text-green-500 text-xs mt-1">↑ 3 new this week</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Employees</p>
          <p className="text-3xl font-black text-blue-600 mt-2">12</p>
          <p className="text-gray-400 text-xs mt-1">Manager · Delivery · Cashier</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Orders This Month</p>
          <p className="text-3xl font-black text-purple-600 mt-2">138</p>
          <p className="text-green-500 text-xs mt-1">↑ 12% vs last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Pending Join Requests</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{requests.length}</p>
          <p className="text-orange-400 text-xs mt-1">Awaiting approval</p>
        </div>
      </div>

      {/* Join Requests Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="flex justify-between items-center p-6 border-b bg-orange-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">📋 New Join Requests</h2>
            <p className="text-gray-400 text-sm mt-0.5">Review applicants and approve to add them to the system</p>
          </div>
          <span className="bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
            {requests.length} Pending
          </span>
        </div>
        <div className="p-6 space-y-4">
          {requests.map(req => (
            <div key={req.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-orange-200 transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${req.bgUrl} rounded-2xl flex items-center justify-center text-2xl`}>👤</div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{req.name}</p>
                    <p className="text-gray-500 text-sm">📞 {req.phone} &nbsp;|&nbsp; 📧 {req.email}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Applied for: <span className={`font-semibold ${req.color}`}>{req.role}</span> &nbsp;|&nbsp; Applied on: {req.applied}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApprove(req.id, req.name)}
                    className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-600 transition text-sm"
                  >
                    ✅ Approve
                  </button>
                  <button 
                    onClick={() => handleReject(req.id)}
                    className="bg-red-100 text-red-600 px-5 py-2 rounded-xl font-semibold hover:bg-red-200 transition text-sm"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
              <div className="mt-3 ml-16 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                <span className="font-semibold">Cover Note:</span> "{req.note}"
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold">All join requests have been processed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Staff List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">👥 Current Active Staff</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="px-6 text-left">Role</th>
                <th className="px-6 text-left">Username</th>
                <th className="px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-semibold">Amit Sharma</td>
                <td className="px-6">📊 Manager</td>
                <td className="px-6 text-gray-400">manager</td>
                <td className="px-6">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-semibold">Neha Singh</td>
                <td className="px-6">🛵 Delivery</td>
                <td className="px-6 text-gray-400">delivery</td>
                <td className="px-6">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 font-semibold">Priya Patel</td>
                <td className="px-6">💳 Cashier</td>
                <td className="px-6 text-gray-400">cashier</td>
                <td className="px-6">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Active</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
