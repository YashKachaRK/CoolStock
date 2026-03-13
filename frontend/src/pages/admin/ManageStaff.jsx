import { useState } from 'react';

const INITIAL_STAFF = [
  { id: 1, name: 'Amit Sharma',    role: 'Manager',  username: 'manager',  email: 'amit@coolstock.in',    phone: '+91 98001 11111', joined: '1 Jan 2025',  status: 'Active', icon: '📊' },
  { id: 2, name: 'Neha Singh',     role: 'Delivery', username: 'delivery', email: 'neha@coolstock.in',    phone: '+91 98002 22222', joined: '5 Jan 2025',  status: 'Active', icon: '🛵' },
  { id: 3, name: 'Priya Patel',    role: 'Cashier',  username: 'cashier',  email: 'priya@coolstock.in',   phone: '+91 98003 33333', joined: '10 Jan 2025', status: 'Active', icon: '💳' },
  { id: 4, name: 'Rohit Das',      role: 'Delivery', username: 'delivery2',email: 'rohit@coolstock.in',   phone: '+91 98004 44444', joined: '15 Feb 2025', status: 'Active', icon: '🛵' },
  { id: 5, name: 'Arjun Mehta',    role: 'Delivery', username: 'delivery3',email: 'arjun@coolstock.in',   phone: '+91 98005 55555', joined: '1 Mar 2025',  status: 'Active', icon: '🛵' },
  { id: 6, name: 'Kavita Shah',    role: 'Cashier',  username: 'cashier2', email: 'kavita@coolstock.in',  phone: '+91 98006 66666', joined: '20 Feb 2025', status: 'Inactive', icon: '💳' },
];

const ROLES = ['All', 'Manager', 'Delivery', 'Cashier'];
const ROLE_COLORS = { Manager: 'bg-indigo-100 text-indigo-700', Delivery: 'bg-orange-100 text-orange-700', Cashier: 'bg-emerald-100 text-emerald-700' };

export default function ManageStaff() {
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewStaff, setViewStaff] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'Manager', username: '', email: '', phone: '', joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Active' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const ROLE_ICONS = { Manager: '📊', Delivery: '🛵', Cashier: '💳' };

  const filtered = staff.filter(s => {
    const matchRole = roleFilter === 'All' || s.role === roleFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleToggleStatus = (id) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
    showToast('✅ Staff status updated.');
  };

  const handleRemove = (id) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setViewStaff(null);
    showToast('🗑️ Staff member removed.', 'error');
  };

  const handleAdd = () => {
    if (!newStaff.name || !newStaff.username || !newStaff.email) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }
    const id = Math.max(...staff.map(s => s.id)) + 1;
    setStaff(prev => [...prev, { ...newStaff, id, icon: ROLE_ICONS[newStaff.role] || '👤' }]);
    setAddModal(false);
    setNewStaff({ name: '', role: 'Manager', username: '', email: '', phone: '', joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Active' });
    showToast('🎉 New staff member added!');
  };

  const roleCounts = ROLES.slice(1).reduce((acc, r) => { acc[r] = staff.filter(s => s.role === r).length; return acc; }, {});
  const activeCount = staff.filter(s => s.status === 'Active').length;

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-700 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">👥 Manage Staff</h1>
          <p className="opacity-80 mt-1 text-sm">View, add, and manage all CoolStock employees</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="bg-white text-slate-800 font-bold px-3 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-gray-100 transition shadow text-xs md:text-sm shrink-0"
        >
          ➕ Add
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Total Staff</p>
          <p className="text-3xl font-black text-slate-700 mt-2">{staff.length}</p>
          <p className="text-gray-400 text-xs mt-1">All roles</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Active Now</p>
          <p className="text-3xl font-black text-green-600 mt-2">{activeCount}</p>
          <p className="text-green-400 text-xs mt-1">Currently working</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Delivery Boys</p>
          <p className="text-3xl font-black text-orange-500 mt-2">{roleCounts['Delivery'] || 0}</p>
          <p className="text-orange-400 text-xs mt-1">On the road</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Cashiers</p>
          <p className="text-3xl font-black text-emerald-600 mt-2">{roleCounts['Cashier'] || 0}</p>
          <p className="text-gray-400 text-xs mt-1">At counter</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b bg-gray-50 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-blue-400 outline-none w-full sm:w-68"
          />
          <div className="flex gap-2">
            {ROLES.map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${roleFilter === r ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'}`}
              >
                {r === 'All' ? '👥 All' : `${ROLE_ICONS[r]} ${r}`}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400 font-semibold">{filtered.length} member{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Employee</th>
                <th className="px-6 text-left">Role</th>
                <th className="px-6 text-left">Username</th>
                <th className="px-6 text-left">Contact</th>
                <th className="px-6 text-left">Joined</th>
                <th className="px-6 text-left">Status</th>
                <th className="px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-gray-400">
                    <div className="text-5xl mb-3">👻</div>
                    <p className="font-semibold">No staff found</p>
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id} className={`hover:bg-gray-50 transition ${s.status === 'Inactive' ? 'opacity-60' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">{s.icon}</div>
                      <div>
                        <p className="font-bold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ROLE_COLORS[s.role]}`}>{s.icon} {s.role}</span>
                  </td>
                  <td className="px-6 text-gray-500 font-mono text-xs">{s.username}</td>
                  <td className="px-6 text-gray-500 text-xs">{s.phone}</td>
                  <td className="px-6 text-gray-400 text-xs">{s.joined}</td>
                  <td className="px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.status === 'Active' ? '✅ Active' : '⏸ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewStaff(s)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition">👁 View</button>
                      <button onClick={() => handleToggleStatus(s.id)} className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-200 transition">
                        {s.status === 'Active' ? '⏸' : '▶️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Staff Modal */}
      {viewStaff && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setViewStaff(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-blue-700 text-white p-7 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">{viewStaff.icon}</div>
              <h2 className="text-2xl font-black">{viewStaff.name}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20`}>{ROLE_COLORS[viewStaff.role] ? viewStaff.role : viewStaff.role}</span>
            </div>
            <div className="p-7 space-y-3">
              {[['👤 Username', viewStaff.username], ['📧 Email', viewStaff.email], ['📞 Phone', viewStaff.phone], ['📅 Joined', viewStaff.joined], ['⚡ Status', viewStaff.status]].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{val}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleRemove(viewStaff.id)}
                  className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-2xl hover:bg-red-200 transition text-sm"
                >
                  🗑️ Remove Staff
                </button>
                <button onClick={() => setViewStaff(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">➕</div>
              <h2 className="text-2xl font-black text-gray-800">Add Staff Member</h2>
              <p className="text-gray-400 text-sm mt-1">Fill in the details to add a new employee</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name *</label>
                  <input placeholder="e.g. Suresh Gupta" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                  <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-400 outline-none text-sm bg-white">
                    <option>Manager</option>
                    <option>Delivery</option>
                    <option>Cashier</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username *</label>
                  <input placeholder="e.g. suresh_mgr" value={newStaff.username} onChange={e => setNewStaff({ ...newStaff, username: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input placeholder="+91 98000 00000" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-400 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address *</label>
                <input type="email" placeholder="suresh@coolstock.in" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-400 outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 py-3 bg-gradient-to-r from-slate-700 to-blue-600 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg">
                🎉 Add Staff
              </button>
              <button onClick={() => setAddModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
