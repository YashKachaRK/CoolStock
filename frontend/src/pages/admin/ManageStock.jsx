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
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesTab = activeTab === "all" || p.stock <= p.lowThreshold;
    return matchesSearch && matchesCategory && matchesTab;
  });

  // ✅ RESTOCK SAVE
  const handleRestockSave = async () => {
    if (!restockData.qty || !restockData.expiry_date) {
      showToast("⚠️ Quantity and Expiry Date are required", "error");
      return;
    }
    try {
      await axios.put(`${API}/restock/${restockModal.id}`, restockData);
      setRestockModal(null);
      setRestockData({ qty: '', expiry_date: '', batch_code: '' });
      fetchProducts();
      showToast("✅ Stock restocked and batch recorded!", "success");
    } catch (err) {
      showToast("❌ Restock failed", "error");
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

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-700 text-white p-5 md:p-7 rounded-2xl mb-6 md:mb-8 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl md:text-3xl font-black">📦 Manage Stock</h1>
          <p className="opacity-80 mt-1 text-sm">
            Monitor inventory, restock products, and manage the full catalogue
          </p>
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
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-default">
          <p className="text-gray-400 text-sm">Total Products</p>
          <p className="text-3xl font-black text-slate-700 mt-2">
            {products.length}
          </p>
          <p className="text-gray-400 text-xs mt-1">In catalogue</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-default">
          <p className="text-gray-400 text-sm">Total Cartons</p>
          <p className="text-3xl font-black text-indigo-600 mt-2">
            {products.reduce((s, p) => s + p.stock, 0)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Across all products</p>
        </div>
        <div
          className={`p-6 rounded-2xl shadow hover:scale-105 transition cursor-pointer ${lowStockProducts.length > 0 ? "bg-red-50 border-2 border-red-200" : "bg-white"}`}
          onClick={() => setActiveTab("low")}
        >
          <p className="text-gray-400 text-sm">Low Stock Items</p>
          <p
            className={`text-3xl font-black mt-2 ${lowStockProducts.length > 0 ? "text-red-600" : "text-green-600"}`}
          >
            {lowStockProducts.length}
          </p>
          <p
            className={`text-xs mt-1 ${lowStockProducts.length > 0 ? "text-red-400" : "text-green-400"}`}
          >
            {lowStockProducts.length > 0
              ? "⚠️ Needs restocking"
              : "✅ All good"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition cursor-default">
          <p className="text-gray-400 text-sm">Catalogue Value</p>
          <p className="text-3xl font-black text-purple-600 mt-2">
            ₹
            {products
              .reduce((s, p) => s + p.price * p.stock, 0)
              .toLocaleString("en-IN")}
          </p>
          <p className="text-gray-400 text-xs mt-1">Total inventory worth</p>
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
        <div className="p-4 md:p-5 border-b bg-gray-50 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm focus:border-indigo-400 outline-none w-full sm:w-60"
          />
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
                <th className="py-3 px-6 text-left">Product</th>
                <th className="px-6 text-left">Category</th>
                <th className="px-6 text-left">Unit</th>
                <th className="px-6 text-left">Price / Carton</th>
                <th className="px-6 text-left">Stock</th>
                <th className="px-6 text-left">Status</th>
                <th className="px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-gray-400">
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
                    onEdit={() => setEditModal({ ...p })}
                    onRestock={(p) => setRestockModal(p)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====== RESTOCK MODAL ====== */}
      {restockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setRestockModal(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-md p-8">
            <h2 className="text-2xl font-black text-gray-800 mb-2">Restock Product</h2>
            <p className="text-gray-400 text-sm mb-6">{restockModal.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity (Cartons) *</label>
                <input type="number" value={restockData.qty} onChange={e => setRestockData({ ...restockData, qty: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date *</label>
                <input type="date" value={restockData.expiry_date} onChange={e => setRestockData({ ...restockData, expiry_date: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Code (Optional)</label>
                <input type="text" value={restockData.batch_code} onChange={e => setRestockData({ ...restockData, batch_code: e.target.value })}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-green-500" placeholder="e.g. B-902" />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={handleRestockSave} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition">🚀 Restock Now</button>
              <button onClick={() => setRestockModal(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setAddModal(false); }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">➕</div>
              <h2 className="text-2xl font-black text-gray-800">Add New Product</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name *</label>
                  <input placeholder="e.g. Pista Kulfi" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm bg-white" >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (<option key={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit *</label>
                  <input placeholder="e.g. Carton (24 pieces)" value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹) *</label>
                  <input type="number" placeholder="720" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Stock *</label>
                  <input type="number" placeholder="50" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-indigo-400 outline-none text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleAddProduct} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:opacity-90 transition">🎉 Add Product</button>
              <button onClick={() => setAddModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 text-white px-6 py-3 rounded-2xl shadow-2xl font-semibold z-50 transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ---- Row sub-component ----
function ProductRow({ product, stockBadge, onEdit, onRestock, onDelete }) {
  const isLow = product.stock <= product.lowThreshold;

  return (
    <tr className={`hover:bg-gray-50 transition ${isLow ? "bg-red-50" : ""}`}>
      <td className="py-4 px-6">
        <span className="font-bold text-gray-800">{product.name}</span>
      </td>
      <td className="px-6 text-gray-500">{product.category}</td>
      <td className="px-6 text-gray-500 text-xs">{product.unit}</td>
      <td className="px-6 font-semibold text-indigo-700">₹{product.price.toLocaleString("en-IN")}</td>
      <td className="px-6">
        <span className={`font-black text-lg ${isLow ? "text-red-600" : "text-gray-800"}`}>{product.stock}</span>
        <span className="text-gray-400 text-xs ml-1">cartons</span>
      </td>
      <td className="px-6">{stockBadge(product.stock, product.lowThreshold)}</td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => onRestock(product)} className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition">📦 Restock</button>
          <button onClick={onEdit} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-200 transition">✏️ Edit</button>
          <button onClick={() => onDelete(product.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  );
}
