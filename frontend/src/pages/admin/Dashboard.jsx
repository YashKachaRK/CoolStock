import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCustomers: 0,
    totalStaff: 0,
    lowStock: 0,
    recentOrders: []
  });
  const [requests, setRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const API = "http://localhost:5000";

  const fetchDashboardData = async () => {
    // 1. Fetch Stats
    try {
      const res = await axios.get(`${API}/adminStats`);
      setStats(res.data);
    } catch (err) {
      console.error("Stats Fetch Error:", err);
      showToast("❌ Failed to load statistics", "error");
    }

    // 2. Fetch Applications
    try {
      const res = await axios.get(`${API}/admin/applications`);
      setRequests(res.data.filter(r => r.status === 'Pending'));
    } catch (err) {
      console.error("Applications Fetch Error:", err);
      showToast("❌ Failed to load join requests", "error");
    }

    // 3. Fetch Staff
    try {
      const res = await axios.get(`${API}/staff`);
      setStaffList(res.data.filter(s => s.status === 'Active').slice(0, 5));
    } catch (err) {
      console.error("Staff Fetch Error:", err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleApprove = async (id, name) => {
    try {
      showToast(`⏳ Approving ${name}...`, 'info');
      await axios.put(`${API}/admin/updateApplication/${id}`, { status: 'Accepted' });
      showToast(`✅ ${name} has been approved!`, 'success');
      fetchDashboardData();
    } catch (err) {
      console.error("Approval Error:", err.response?.data || err.message);
      showToast(`❌ Error: ${err.response?.data || 'Failed to approve'}`, 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${API}/admin/updateApplication/${id}`, { status: 'Rejected' });
      showToast('❌ Application rejected.', 'error');
      fetchDashboardData();
    } catch (err) {
      showToast('❌ Error rejecting application', 'error');
    }
  };

  const formattedTime = time.toLocaleTimeString('en-US', { hour12: false });
  const formattedDate = time.toDateString();

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-700 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">⚙️ Admin Control Panel</h1>
          <p className="opacity-80 mt-1 text-sm md:text-base">CoolStock — Ice Cream Wholesale System</p>
        </div>
        <div className="text-right">
          <div className="text-xs md:text-sm opacity-70 hidden sm:block">{formattedDate}</div>
          <div className="text-lg md:text-2xl font-bold mt-1">{formattedTime}</div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Customers</p>
          <p className="text-3xl font-black text-slate-700 mt-2">{stats.activeCustomers}</p>
          <p className="text-green-500 text-xs mt-1">Live from database</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Staff</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{stats.totalStaff}</p>
          <p className="text-gray-400 text-xs mt-1">Active employees</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-3xl font-black text-purple-600 mt-2">{stats.totalOrders}</p>
          <p className="text-green-500 text-xs mt-1">All time count</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer">
          <p className="text-gray-400 text-sm">Low Stock Items</p>
          <p className="text-3xl font-black text-rose-500 mt-2">{stats.lowStock}</p>
          <p className="text-rose-400 text-xs mt-1">Needs attention</p>
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
                  <div className={`w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl`}>👤</div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{req.full_name}</p>
                    <p className="text-gray-500 text-sm">📞 {req.phone} &nbsp;|&nbsp; 📧 {req.email}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Applied for: <span className={`font-semibold text-blue-600`}>{req.role}</span> &nbsp;|&nbsp; Applied on: {new Date(req.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(req.id, req.full_name)}
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
                <span className="font-semibold">Cover Note:</span> "{req.description}"
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-semibold">No pending join requests</p>
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
              {staffList.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 font-semibold">{s.name}</td>
                  <td className="px-6">{s.role}</td>
                  <td className="px-6 text-gray-400">{s.username}</td>
                  <td className="px-6">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.status}</span>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-5 text-center text-gray-400">No active staff found</td>
                </tr>
              )}
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
