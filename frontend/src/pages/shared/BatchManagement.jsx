import { useState, useEffect } from 'react';
import axios from 'axios';

const BATCH_STATUS = {
  VALID: { color: 'bg-green-100 text-green-700', label: '✅ Valid', icon: '🟢' },
  EXPIRING: { color: 'bg-yellow-100 text-yellow-700', label: '⚠️ Expiring Soon', icon: '🟡' },
  EXPIRED: { color: 'bg-red-100 text-red-700', label: '❌ Expired', icon: '🔴' }
};

export default function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    product_id: '',
    batch_number: '',
    quantity: '',
    expiry_date: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', ok: true });

  const API = "http://localhost:5000";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [batchRes, prodRes] = await Promise.all([
        axios.get(`${API}/product-batches`),
        axios.get(`${API}/products`)
      ]);
      setBatches(batchRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
      showToast('❌ Error fetching batch data', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, ok = true) => {
    setToast({ show: true, message: msg, ok });
    setTimeout(() => setToast({ show: false, message: '', ok: true }), 3000);
  };

  const getStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return BATCH_STATUS.EXPIRED;
    if (diffDays <= 30) return BATCH_STATUS.EXPIRING;
    return BATCH_STATUS.VALID;
  };

  const handleAddBatch = async () => {
    if (!newBatch.product_id || !newBatch.quantity || !newBatch.expiry_date) {
      showToast('⚠️ Please fill required fields', false);
      return;
    }
    try {
      await axios.post(`${API}/product-batches`, newBatch);
      showToast('📦 Batch added and stock updated!');
      setShowAddModal(false);
      setNewBatch({ product_id: '', batch_number: '', quantity: '', expiry_date: '' });
      fetchData();
    } catch (err) {
      showToast('❌ Error adding batch', false);
    }
  };

  const handleDeleteBatch = async (id) => {
    if (!window.confirm('Delete this batch? This will also deduct quantity from total stock.')) return;
    try {
      await axios.delete(`${API}/product-batches/${id}`);
      showToast('🗑️ Batch removed and stock adjusted');
      fetchData();
    } catch (err) {
      showToast('❌ Error deleting batch', false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-4">📦</div>
        <p className="text-gray-500 font-semibold">Loading batch data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-red-700 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">📅 Expiry Management</h1>
          <p className="opacity-80 mt-1 text-sm">Track product batches, expiry dates, and manage stock freshness</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-white text-slate-800 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
        >
          ➕ Add New Batch
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-green-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Fresh Batches</p>
          <p className="text-3xl font-black text-gray-800 mt-1">
            {batches.filter(b => getStatus(b.expiry_date) === BATCH_STATUS.VALID).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-yellow-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Expiring Soon (&lt; 30 days)</p>
          <p className="text-3xl font-black text-gray-800 mt-1">
            {batches.filter(b => getStatus(b.expiry_date) === BATCH_STATUS.EXPIRING).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow border-l-4 border-red-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Expired Items</p>
          <p className="text-3xl font-black text-gray-800 mt-1">
            {batches.filter(b => getStatus(b.expiry_date) === BATCH_STATUS.EXPIRED).length}
          </p>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Product</th>
                <th className="px-6 text-left">Batch Number</th>
                <th className="px-6 text-left">Quantity</th>
                <th className="px-6 text-left">Received Date</th>
                <th className="px-6 text-left">Expiry Date</th>
                <th className="px-6 text-left">Status</th>
                <th className="px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-gray-400">
                    <div className="text-5xl mb-3">📅</div>
                    <p className="font-semibold">No batches recorded</p>
                  </td>
                </tr>
              ) : batches.map(batch => {
                const status = getStatus(batch.expiry_date);
                const isExpired = status === BATCH_STATUS.EXPIRED;
                return (
                  <tr key={batch.id} className={`hover:bg-gray-50 transition ${isExpired ? 'bg-red-50' : ''}`}>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{batch.product_id?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-gray-400">{batch.product_id?.category}</p>
                    </td>
                    <td className="px-6 font-mono text-xs">{batch.batch_number || '—'}</td>
                    <td className="px-6 font-bold">{batch.quantity} <span className="text-gray-400 font-normal text-xs">{batch.product_id?.unit}</span></td>
                    <td className="px-6 text-gray-500 text-xs">{new Date(batch.received_at).toLocaleDateString('en-IN')}</td>
                    <td className={`px-6 font-bold text-xs ${isExpired ? 'text-red-600' : ''}`}>
                      {new Date(batch.expiry_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6">
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                        title="Remove/Dispose Batch"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-2">➕ Add New Batch</h2>
            <p className="text-gray-400 text-sm mb-6">Create a new stock batch with expiry tracking</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product *</label>
                <select
                  value={newBatch.product_id}
                  onChange={e => setNewBatch({ ...newBatch, product_id: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-red-400 outline-none text-sm bg-white"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BATCH-2026-001"
                  value={newBatch.batch_number}
                  onChange={e => setNewBatch({ ...newBatch, batch_number: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-red-400 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity *</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={newBatch.quantity}
                    onChange={e => setNewBatch({ ...newBatch, quantity: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-red-400 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={newBatch.expiry_date}
                    onChange={e => setNewBatch({ ...newBatch, expiry_date: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-red-400 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleAddBatch}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition shadow-lg"
              >
                💾 Save Batch
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 text-white ${toast.ok ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
