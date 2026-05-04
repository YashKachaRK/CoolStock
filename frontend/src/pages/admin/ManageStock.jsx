import { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES = ["All", "Cone", "Cup", "Shake", "Pack", "Bar"];

export default function ManageStock() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'low'
  const [editModal, setEditModal] = useState(null); // product being edited
  const [addModal, setAddModal] = useState(false);
  const [restockModal, setRestockModal] = useState(null); // product being restocked
  const [restockData, setRestockData] = useState({ qty: '', expiry_date: '', batch_code: '' });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Cone",
    unit: "",
    price: "",
    stock: "",
    lowThreshold: 10,
    flavor: "",
    description: "",
    expiry_date: ""
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const API = "http://localhost:5000";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStockProducts = products.filter((p) => p.stock <= p.lowThreshold);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.flavor && p.flavor.toLowerCase().includes(search.toLowerCase())) ||
      p.id.toString().toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesTab = activeTab === "all" || p.stock <= p.lowThreshold;
    return matchesSearch && matchesCategory && matchesTab;
  });

  // ✅ QUICK RESTOCK
  const handleRestock = async ({ id, qty, expiry_date }) => {
    try {
      await axios.put(`${API}/restock/${id}`, { qty, expiry_date });
      fetchProducts();
      showToast("✅ Stock added and batch recorded!", "success");
    } catch (err) {
      showToast("❌ Add failed", "error");
    }
  };

  // ✅ EDIT SAVE
  const handleEditSave = async () => {
    try {
      await axios.put(`${API}/updateProduct/${editModal.id}`, editModal);
      setEditModal(null);
      fetchProducts();
      showToast("✏️ Product updated!", "success");
    } catch (err) {
      showToast("❌ Update failed", "error");
    }
  };

  // ✅ ADD PRODUCT
  const handleAddProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.unit ||
      !newProduct.price ||
      !newProduct.stock
    ) {
      showToast("⚠️ Fill all fields!", "error");
      return;
    }

    try {
      await axios.post(`${API}/addProduct`, {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        lowThreshold: Number(newProduct.lowThreshold),
      });

      setAddModal(false);
      fetchProducts();

      setNewProduct({
        name: "",
        category: "Cone",
        unit: "",
        price: "",
        stock: "",
        lowThreshold: 10,
        flavor: "",
        description: "",
        expiry_date: ""
      });

      showToast("🎉 Product added!", "success");
    } catch (err) {
      showToast("❌ Add failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${API}/deleteProduct/${id}`);
      fetchProducts();
      showToast("🗑️ Product deleted!", "success");
    } catch (err) {
      showToast("❌ Delete failed", "error");
    }
  };

  const stockBadge = (stock, threshold) => {
    if (stock <= threshold) {
      return (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
          🔴 Low Stock
        </span>
      );
    }
    if (stock <= threshold * 2) {
      return (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">
          🟡 Medium
        </span>
      );
    }
    return (
      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
        🟢 In Stock
      </span>
    );
  };

  const expiryBadge = (expiryDate) => {
    if (!expiryDate) return <span className="text-gray-400 text-xs italic">No batches recorded</span>;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
          ❌ Expired
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <div className="flex flex-col">
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase w-fit">
            ⚠️ Soon
          </span>
          <span className="text-[10px] text-yellow-600 mt-0.5 font-bold">{diffDays} days left</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col">
        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase w-fit">
          ✅ Fresh
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">{expiry.toLocaleDateString('en-IN')}</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1976d2] to-[#00bcd4] text-white p-10 rounded-[40px] mb-10 flex justify-between items-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black tracking-tight">Inventory Control</h1>
          <p className="opacity-90 mt-2 text-base font-medium">
            Manager Operations Dashboard — Secure SKU Registry
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="bg-[#1a237e] text-white font-black px-8 py-4 rounded-2xl hover:bg-[#0d47a1] transition shadow-xl uppercase tracking-widest text-xs">
            📊 Export CSV
          </button>
          <button
            onClick={() => setAddModal(true)}
            className="bg-white text-[#1976d2] font-black px-8 py-4 rounded-2xl hover:bg-gray-50 transition shadow-xl uppercase tracking-widest text-xs"
          >
            ➕ Commission SKU
          </button>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mb-10">
        <div className="bg-white p-8 rounded-[30px] shadow-xl hover:scale-105 transition cursor-default border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Registry Total</p>
          <p className="text-4xl font-black text-slate-700 mt-2">
            {products.length}
          </p>
          <p className="text-gray-400 text-[10px] mt-1 font-bold">In catalogue</p>
        </div>
        <div className="bg-white p-8 rounded-[30px] shadow-xl hover:scale-105 transition cursor-default border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Categories</p>
          <p className="text-4xl font-black text-indigo-600 mt-2">
            {CATEGORIES.length - 1}
          </p>
          <p className="text-gray-400 text-[10px] mt-1 font-bold">Active types</p>
        </div>
        <div
          className={`p-8 rounded-[30px] shadow-xl hover:scale-105 transition cursor-pointer border ${lowStockProducts.length > 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-100"}`}
          onClick={() => setActiveTab("low")}
        >
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Alert Levels</p>
          <p
            className={`text-4xl font-black mt-2 ${lowStockProducts.length > 0 ? "text-red-600" : "text-green-600"}`}
          >
            {lowStockProducts.length}
          </p>
          <p className="text-gray-400 text-[10px] mt-1 font-bold">Requires attention</p>
        </div>
        <div className="bg-white p-8 rounded-[30px] shadow-xl hover:scale-105 transition cursor-default border border-gray-100">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Active Selection</p>
          <p className="text-4xl font-black text-teal-600 mt-2">
            {filteredProducts.length}
          </p>
          <p className="text-gray-400 text-[10px] mt-1 font-bold">Currently viewing</p>
        </div>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <div className="text-3xl">🚨</div>
          <div className="flex-1">
            <p className="font-bold text-red-700 text-lg">Low Stock Alert!</p>
            <p className="text-red-500 text-sm mt-0.5">
              {lowStockProducts
                .map((p) => `${p.name} (${p.stock} left)`)
                .join(" · ")}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("low")}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition"
          >
            View All →
          </button>
        </div>
      )}

      {/* Tabs + Filters */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === "all" ? "text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50" : "text-gray-500 hover:bg-gray-50"}`}
          >
            📋 All Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("low")}
            className={`flex-1 py-4 font-bold text-sm transition ${activeTab === "low" ? "text-red-700 border-b-2 border-red-600 bg-red-50" : "text-gray-500 hover:bg-gray-50"}`}
          >
            🔴 Low Stock ({lowStockProducts.length})
          </button>
        </div>

        {/* Search + Category Filters */}
        <div className="p-6 md:p-8 border-b bg-gray-50/50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Filter by name, flavour, or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-sm font-bold bg-white shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-400"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-gray-400 font-semibold">
            {filteredProducts.length} result
            {filteredProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 text-left">Product</th>
                <th className="px-6 text-left">Category</th>
                <th className="px-6 text-left">Unit Price</th>
                <th className="px-6 text-left">In Stock</th>
                <th className="px-6 text-left">Stock Status</th>
                <th className="px-6 text-left">Expiry Status</th>
                <th className="px-6 text-center">Quick Add (+ Amt)</th>
                <th className="px-6 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-gray-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-semibold">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    stockBadge={stockBadge}
                    expiryBadge={expiryBadge}
                    onEdit={() => setEditModal({ ...p })}
                    onRestock={handleRestock}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      

      {/* ====== EDIT MODAL ====== */}
      {editModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditModal(null);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-6">Edit Product</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                  <input value={editModal.name} onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹ / carton)</label>
                  <input type="number" value={editModal.price} onChange={(e) => setEditModal({ ...editModal, price: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock (cartons)</label>
                  <input type="number" value={editModal.stock} onChange={(e) => setEditModal({ ...editModal, stock: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Flavor</label>
                    <input value={editModal.flavor} onChange={(e) => setEditModal({ ...editModal, flavor: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Low Threshold</label>
                    <input type="number" value={editModal.lowThreshold} onChange={(e) => setEditModal({ ...editModal, lowThreshold: Number(e.target.value) })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                  <textarea value={editModal.description} onChange={(e) => setEditModal({ ...editModal, description: e.target.value })} rows="2"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm resize-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleEditSave} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition">💾 Save Changes</button>
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ====== ADD PRODUCT MODAL ====== */}
      {addModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setAddModal(false); }}
        >
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1976d2] to-[#03a9f4] p-8 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight">Commission New SKU</h2>
                <button onClick={() => setAddModal(false)} className="text-white/80 hover:text-white text-2xl">✕</button>
              </div>
            </div>

            <div className="p-10 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                <input 
                  placeholder="e.g. Mango Magic Stick" 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={newProduct.category} 
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50 appearance-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (<option key={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Flavor</label>
                  <input 
                    placeholder="e.g. Mango" 
                    value={newProduct.flavor} 
                    onChange={(e) => setNewProduct({ ...newProduct, flavor: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Unit Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="30.00" 
                    value={newProduct.price} 
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Initial Stock Units</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    value={newProduct.stock} 
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                <input 
                  type="date" 
                  value={newProduct.expiry_date} 
                  onChange={(e) => setNewProduct({ ...newProduct, expiry_date: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50" 
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">SKU Description</label>
                <textarea 
                  placeholder="Enter product details..." 
                  value={newProduct.description} 
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows="3"
                  className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-indigo-400 outline-none text-base font-bold bg-gray-50/50 resize-none" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setAddModal(false)} className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest hover:text-gray-700 transition">Cancel</button>
                <button 
                  onClick={handleAddProduct} 
                  className="flex-1 py-4 bg-[#1a237e] text-white font-black rounded-2xl hover:bg-[#0d47a1] transition shadow-xl shadow-indigo-100 uppercase tracking-widest"
                >
                  Register SKU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ---- Row sub-component ----
function ProductRow({ product, stockBadge, expiryBadge, onEdit, onRestock, onDelete }) {
  const [restockQty, setRestockQty] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const isLow = product.stock <= product.lowThreshold;
  const isExpired = product.nearest_expiry && (new Date(product.nearest_expiry) < new Date());

  const handleQuickAdd = async () => {
    if (!restockQty || !expiryDate) return;
    await onRestock({ id: product.id, qty: restockQty, expiry_date: expiryDate });
    setRestockQty("");
    setExpiryDate("");
  };

  return (
    <tr className={`hover:bg-gray-50 transition border-b border-gray-100 ${isLow || isExpired ? "bg-red-50/50" : ""}`}>
      <td className="py-6 px-6">
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-base">{product.name}</span>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">PROD-{product.id.toString().slice(-4)}</span>
        </div>
      </td>
      <td className="px-6">
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider">{product.category}</span>
      </td>
      <td className="px-6 font-black text-indigo-700 text-base">₹{product.price.toLocaleString("en-IN")}</td>
      <td className="px-6">
        <div className="flex items-baseline gap-1">
          <span className={`font-black text-xl ${isLow ? "text-red-600" : "text-gray-800"}`}>{product.stock}</span>
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Units</span>
        </div>
      </td>
      <td className="px-6">{stockBadge(product.stock, product.lowThreshold)}</td>
      <td className="px-6">{expiryBadge(product.nearest_expiry)}</td>
      <td className="px-6 py-6">
        <div className="flex flex-col items-center gap-2 max-w-[140px] mx-auto">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="0"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              className="w-16 border-2 border-gray-100 rounded-xl px-2 py-2 text-sm font-bold focus:border-green-400 outline-none text-center shadow-sm"
            />
            <button
              onClick={handleQuickAdd}
              className="bg-[#009688] text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-[#00796b] transition shadow-md shadow-teal-100 uppercase"
            >
              Add
            </button>
          </div>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-2 py-1.5 text-[10px] font-bold focus:border-green-400 outline-none text-center shadow-sm text-gray-500"
          />
        </div>
      </td>
      <td className="px-6 py-6 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-100 transition uppercase tracking-wider">Edit</button>
          <button onClick={() => onDelete(product.id)} className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition uppercase tracking-wider">Delete</button>
        </div>
      </td>
    </tr>
  );
}
