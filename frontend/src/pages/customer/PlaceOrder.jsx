import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PlaceOrder() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [urgency, setUrgency] = useState('Regular');
  const [profileData, setProfileData] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  useEffect(() => {
    const initPage = async () => {
      try {
        // 1. Fetch Products
        const prodRes = await axios.get(`${API}/products`);
        setProducts(prodRes.data);

        // 2. Fetch Customer Profile
        const profRes = await axios.get(`${API}/customerProfile`);
        setProfileData(profRes.data);

        // Initialize cart
        const initialCart = {};
        prodRes.data.forEach(p => initialCart[p.id] = 0);
        setCart(initialCart);

        setLoading(false);
      } catch (err) {
        console.error("Initialization failed:", err);
        setLoading(false);
      }
    };
    initPage();
  }, []);

  const changeQty = (id, delta) => {
    setCart(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const product = products.find(p => p.id === Number(id));
      if (product) total += product.price * qty;
    });
    return total;
  };

  const hasItems = Object.values(cart).some(q => q > 0);
  const total = calculateTotal();

  const handlePlaceOrder = async () => {
    if (!hasItems) {
      alert('Please select at least 1 carton!');
      return;
    }

    const orderNumber = 'ORD-' + (Math.floor(Math.random() * 9000) + 1000);
    const selectedItems = [];
    Object.entries(cart).forEach(([id, qty]) => {
      if (qty > 0) {
        const product = products.find(p => p.id === Number(id));
        selectedItems.push({
          product_id: Number(id),
          quantity: qty,
          price_per_unit: product.price
        });
      }
    });

    try {
      await axios.post(`${API}/placeOrder`, {
        customer_id: profileData.id,
        order_number: orderNumber,
        amount: total,
        urgency: urgency,
        items: selectedItems
      });

      setModalData({ id: orderNumber });
      // Reset cart
      const resetCart = {};
      products.forEach(p => resetCart[p.id] = 0);
      setCart(resetCart);
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading shop data...</div>;
  if (!profileData) return <div className="p-10 text-center text-red-500">Failed to load profile. Please login again.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-7 rounded-3xl mb-8 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">📦 Welcome back, {profileData.name}!</h1>
          <p className="opacity-80 mt-1 text-sm">Ordering for: <span className="font-bold underline">{profileData.shop}</span></p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs opacity-70 uppercase font-black">Total Cartons</p>
          <p className="text-3xl font-black">{Object.values(cart).reduce((a, b) => a + b, 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">🛒 Bulk Ice Cream Catalog</h2>
            <span className="text-xs text-gray-400 font-bold uppercase">{products.length} Products Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-gray-100 flex gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shrink-0">🍦</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{p.name}</h3>
                  <p className="text-xs text-gray-400 font-semibold">{p.unit}</p>
                  <div className="flex justify-between items-end mt-3">
                    <p className="text-purple-600 font-black text-xl">₹{p.price}</p>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 px-2 border">
                      <button onClick={() => changeQty(p.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500 font-bold">−</button>
                      <span className="font-black text-lg w-6 text-center">{cart[p.id] || 0}</span>
                      <button onClick={() => changeQty(p.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-500 font-bold">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-7 sticky top-24 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📋</span> Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {!hasItems ? (
                <div className="py-10 text-center">
                  <p className="text-gray-300 italic text-sm">Your cart is empty</p>
                  <p className="text-[10px] text-gray-300 mt-1 uppercase font-bold">Add some cartons to start</p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const product = products.find(p => p.id === Number(id));
                  return qty > 0 && product && (
                    <div key={id} className="flex justify-between items-center group">
                      <div>
                        <p className="font-bold text-gray-700 text-sm">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{qty} Cartons × ₹{product.price}</p>
                      </div>
                      <span className="font-black text-gray-800">₹{(product.price * qty).toLocaleString('en-IN')}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-dashed pt-6 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span className="font-black text-green-500 text-xs uppercase tracking-wider">Free Shipping</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t">
                <span className="font-bold text-gray-800">Total Payable</span>
                <span className="text-2xl font-black text-purple-600">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Delivery Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:border-purple-400 outline-none bg-gray-50 cursor-pointer"
                >
                  <option value="Regular">🗓️ Regular (1-2 Days)</option>
                  <option value="Urgent">⚡ Urgent (Tomorrow)</option>
                  <option value="Very Urgent">🔥 Immediate (Today)</option>
                </select>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Delivery Address</p>
                  <Link to="/customer/profile" className="text-[10px] text-purple-600 font-black uppercase underline">Change</Link>
                </div>
                <p className="text-xs font-bold text-gray-800">{profileData.shop}</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{profileData.addr}</p>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!hasItems}
              className={`mt-6 w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${hasItems
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:scale-[1.02] active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              🚀 Place Bulk Order
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-4 tracking-widest flex items-center justify-center gap-2">
              🛡️ Secure COD Payment
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-10 text-center border-4 border-purple-100">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">✅</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">Your bulk order <strong>{modalData.id}</strong> has been placed successfully. A delivery boy will be assigned shortly.</p>

            <div className="flex flex-col gap-3">
              <Link
                to="/customer/track_order"
                className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition shadow-lg shadow-purple-200"
              >
                📍 Track My Order
              </Link>
              <button
                onClick={() => setModalData(null)}
                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
