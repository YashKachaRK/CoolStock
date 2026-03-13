import { useState } from 'react';

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Ramesh Patel',    shop: 'Ramesh General Store',    addr: 'Village Khari, Dist. Anand', phone: '+91 94001 11111', email: 'ramesh@gmail.com',  orders: 8,  totalSpent: 62400, joined: '5 Jan 2025',  status: 'Active' },
  { id: 2, name: 'Suresh Kumar',    shop: 'Kumar Sweets & Stores',   addr: 'Borsad, Anand',              phone: '+91 94002 22222', email: 'suresh@gmail.com',  orders: 5,  totalSpent: 44200, joined: '12 Jan 2025', status: 'Active' },
  { id: 3, name: 'Vijay Sharma',    shop: 'Sharma Cold Store',       addr: 'Anklav, Anand',              phone: '+91 94003 33333', email: 'vijay@gmail.com',   orders: 12, totalSpent: 98700, joined: '20 Jan 2025', status: 'Active' },
  { id: 4, name: 'Kamlesh Patel',   shop: 'Patel Kirana Shop',      addr: 'Nadiad, Kheda',              phone: '+91 94004 44444', email: 'kamlesh@gmail.com', orders: 3,  totalSpent: 22400, joined: '1 Feb 2025',  status: 'Active' },
  { id: 5, name: 'Dilip Joshi',     shop: 'Joshi Provisions',       addr: 'Nadiad, Kheda',              phone: '+91 94005 55555', email: 'dilip@gmail.com',   orders: 6,  totalSpent: 51800, joined: '15 Feb 2025', status: 'Active' },
  { id: 6, name: 'Manoj Mehta',     shop: 'Mehta Traders',          addr: 'Anand City',                 phone: '+91 94006 66666', email: 'manoj@gmail.com',   orders: 9,  totalSpent: 73200, joined: '20 Feb 2025', status: 'Active' },
  { id: 7, name: 'Bhavesh Desai',   shop: 'Desai Marts',            addr: 'Vallabh Vidyanagar',         phone: '+91 94007 77777', email: 'bhavesh@gmail.com', orders: 2,  totalSpent: 14800, joined: '1 Mar 2025',  status: 'Inactive' },
  { id: 8, name: 'Nilesh Soni',     shop: 'Soni Cold Corner',       addr: 'Karamsad, Anand',            phone: '+91 94008 88888', email: 'nilesh@gmail.com',  orders: 7,  totalSpent: 58600, joined: '5 Mar 2025',  status: 'Active' },
];

export default function ManageCustomers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewCustomer, setViewCustomer] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', shop: '', addr: '', phone: '', email: '', orders: 0, totalSpent: 0, joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Active' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const filtered = customers.filter(c => {
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.shop.toLowerCase().includes(search.toLowerCase()) ||
      c.addr.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount = customers.filter(c => c.status === 'Active').length;
  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);

  const handleToggleStatus = (id) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
    showToast('✅ Customer status updated.');
  };

  const handleRemove = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setViewCustomer(null);
    showToast('🗑️ Customer removed.', 'error');
  };

  const handleAdd = () => {
    if (!newCust.name || !newCust.shop || !newCust.phone) {
      showToast('⚠️ Please fill all required fields!', 'error');
      return;
    }
    const id = Math.max(...customers.map(c => c.id)) + 1;
    setCustomers(prev => [...prev, { ...newCust, id }]);
    setAddModal(false);
    setNewCust({ name: '', shop: '', addr: '', phone: '', email: '', orders: 0, totalSpent: 0, joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Active' });
    showToast('🎉 New customer added!');
  };

  // Top spender
  const topSpender = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-rose-600 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">🏪 Manage Customers</h1>
          <p className="opacity-80 mt-1 text-sm">All registered shop-owner customers and their order history</p>
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
          <p className="text-gray-400 text-sm">Total Customers</p>
          <p className="text-3xl font-black text-slate-700 mt-2">{customers.length}</p>
          <p className="text-gray-400 text-xs mt-1">{activeCount} active</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-3xl font-black text-purple-600 mt-2">{totalOrders}</p>
          <p className="text-gray-400 text-xs mt-1">All time</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-3xl font-black text-rose-600 mt-2">₹{(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-xs mt-1">from all customers</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-400 text-sm">Top Spender</p>
          <p className="text-lg font-black text-amber-600 mt-2 truncate">{topSpender?.shop}</p>
          <p className="text-gray-400 text-xs mt-1">₹{topSpender?.totalSpent.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b bg-gray-50 flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search by name, shop or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-rose-400 outline-none w-full sm:w-72"
          />
          <div className="flex gap-2">
            {['All', 'Active', 'Inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${statusFilter === s ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-400'}`}
              >
                {s === 'All' ? '🏪 All' : s === 'Active' ? '✅ Active' : '⏸ Inactive'}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400 font-semibold">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Customer / Shop</th>
                <th className="px-6 text-left">Location</th>
                <th className="px-6 text-left">Contact</th>
                <th className="px-6 text-left">Orders</th>
                <th className="px-6 text-left">Total Spent</th>
                <th className="px-6 text-left">Joined</th>
                <th className="px-6 text-left">Status</th>
                <th className="px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-gray-400">
                    <div className="text-5xl mb-3">🏪</div>
                    <p className="font-semibold">No customers found</p>
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 transition ${c.status === 'Inactive' ? 'opacity-60' : ''}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-xl">🏪</div>
                      <div>
                        <p className="font-bold text-gray-800">{c.shop}</p>
                        <p className="text-xs text-gray-400">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 text-gray-500 text-xs">{c.addr}</td>
                  <td className="px-6">
                    <p className="text-xs text-gray-700">{c.phone}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </td>
                  <td className="px-6">
                    <span className="font-black text-purple-600 text-lg">{c.orders}</span>
                  </td>
                  <td className="px-6 font-bold text-rose-600">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="px-6 text-gray-400 text-xs">{c.joined}</td>
                  <td className="px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status === 'Active' ? '✅ Active' : '⏸ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setViewCustomer(c)} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition">👁 View</button>
                      <button onClick={() => handleToggleStatus(c.id)} className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-200 transition">
                        {c.status === 'Active' ? '⏸' : '▶️'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Customer Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setViewCustomer(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-rose-600 text-white p-7 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3">🏪</div>
              <h2 className="text-2xl font-black">{viewCustomer.shop}</h2>
              <p className="text-sm opacity-80 mt-0.5">{viewCustomer.name}</p>
            </div>
            <div className="p-7 space-y-3">
              {[
                ['📍 Address', viewCustomer.addr],
                ['📞 Phone', viewCustomer.phone],
                ['📧 Email', viewCustomer.email],
                ['📅 Joined', viewCustomer.joined],
                ['🧾 Total Orders', viewCustomer.orders],
                ['💰 Total Spent', `₹${viewCustomer.totalSpent.toLocaleString('en-IN')}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-xs font-bold text-gray-400">{label}</span>
                  <span className="text-sm font-semibold text-gray-800">{val}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleRemove(viewCustomer.id)} className="flex-1 py-3 bg-red-100 text-red-700 font-bold rounded-2xl hover:bg-red-200 transition text-sm">
                  🗑️ Remove
                </button>
                <button onClick={() => setViewCustomer(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">🏪</div>
              <h2 className="text-2xl font-black text-gray-800">Add New Customer</h2>
              <p className="text-gray-400 text-sm mt-1">Register a new shop owner / bulk buyer</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Owner Name *</label>
                  <input placeholder="e.g. Ramesh Patel" value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-rose-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shop Name *</label>
                  <input placeholder="e.g. Ramesh General Store" value={newCust.shop} onChange={e => setNewCust({ ...newCust, shop: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-rose-400 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone *</label>
                  <input placeholder="+91 94000 00000" value={newCust.phone} onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-rose-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input type="email" placeholder="shop@gmail.com" value={newCust.email} onChange={e => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-rose-400 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Shop Address</label>
                <input placeholder="e.g. Village Khari, Dist. Anand" value={newCust.addr} onChange={e => setNewCust({ ...newCust, addr: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-rose-400 outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} className="flex-1 py-3 bg-gradient-to-r from-slate-700 to-rose-600 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg">
                🎉 Add Customer
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
