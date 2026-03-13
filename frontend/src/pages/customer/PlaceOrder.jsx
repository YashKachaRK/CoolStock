import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PRICES = { ChocolateCone: 720, VanillaCone: 660, StrawberryCup: 600, MangoShake: 960, FamilyPack: 2640, ButterscotchCup: 660 };
const LABELS = { ChocolateCone: 'Chocolate Cone', VanillaCone: 'Vanilla Cone', StrawberryCup: 'Strawberry Cup', MangoShake: 'Mango Shake', FamilyPack: 'Family Pack', ButterscotchCup: 'Butterscotch Cup' };

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [cart, setCart] = useState({
    ChocolateCone: 0,
    VanillaCone: 0,
    StrawberryCup: 0,
    MangoShake: 0,
    FamilyPack: 0,
    ButterscotchCup: 0
  });
  
  const [urgency, setUrgency] = useState('Regular');
  const [profileData, setProfileData] = useState({
    shop: 'Ramesh General Store',
    addr: 'Village Khari, Dist. Anand',
    phone: '+91 94001 11111'
  });
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('cs_profile_cust1') || '{}');
    if (profile.shop || profile.addr || profile.phone) {
      setProfileData({ ...profileData, ...profile });
    }
  }, []);

  const changeQty = (name, delta) => {
    setCart(prev => ({
      ...prev,
      [name]: Math.max(0, prev[name] + delta)
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    for (const [k, qty] of Object.entries(cart)) {
      total += PRICES[k] * qty;
    }
    return total;
  };

  const hasItems = Object.values(cart).some(q => q > 0);
  const total = calculateTotal();

  const handlePlaceOrder = () => {
    if (!hasItems) {
      alert('Please select at least 1 carton!');
      return;
    }

    const orderId = '#ORD-' + (300 + Math.floor(Math.random() * 100));
    let orders = JSON.parse(localStorage.getItem('cs_orders') || '[]');

    let selectedItemsArr = [];
    for (const [k, qty] of Object.entries(cart)) {
      if (qty > 0) {
        selectedItemsArr.push(LABELS[k] + ' × ' + qty + ' cartons');
      }
    }
    const itemsStr = selectedItemsArr.join(', ');

    orders.unshift({
      id: orderId,
      shop: profileData.shop,
      addr: profileData.addr,
      phone: profileData.phone,
      items: itemsStr,
      amount: total,
      status: 'Pending',
      urgency: urgency,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    
    localStorage.setItem('cs_orders', JSON.stringify(orders));
    setModalData({ id: orderId });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-7 rounded-2xl mb-8 shadow-lg">
        <h1 className="text-3xl font-black">📦 Place Bulk Order</h1>
        <p className="opacity-80 mt-1">Select products in cartons. Minimum 1 carton per product. We deliver to your shop.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🛒 Select Products (in Cartons)</h2>

          <div className="grid grid-cols-2 gap-4">
            
            <ProductCard 
              icon="🍫" title="Chocolate Cone" desc="1 Carton = 12 cones" price={720} 
              qty={cart.ChocolateCone} onChange={(delta) => changeQty('ChocolateCone', delta)} 
            />
            <ProductCard 
              icon="🍦" title="Vanilla Cone" desc="1 Carton = 12 cones" price={660} 
              qty={cart.VanillaCone} onChange={(delta) => changeQty('VanillaCone', delta)} 
            />
            <ProductCard 
              icon="🍓" title="Strawberry Cup" desc="1 Carton = 24 cups" price={600} 
              qty={cart.StrawberryCup} onChange={(delta) => changeQty('StrawberryCup', delta)} 
            />
            <ProductCard 
              icon="🥭" title="Mango Shake" desc="1 Carton = 12 bottles" price={960} 
              qty={cart.MangoShake} onChange={(delta) => changeQty('MangoShake', delta)} 
            />
            <ProductCard 
              icon="📦" title="Family Pack" desc="1 Case = 12 family packs" price={2640} 
              qty={cart.FamilyPack} onChange={(delta) => changeQty('FamilyPack', delta)} 
            />
            <ProductCard 
              icon="🧈" title="Butterscotch Cup" desc="1 Carton = 24 cups" price={660} 
              qty={cart.ButterscotchCup} onChange={(delta) => changeQty('ButterscotchCup', delta)} 
            />

          </div>
        </div>

        {/* Order Summary + Submit */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4 min-h-[60px]">
              {!hasItems && <p className="text-gray-300 italic">No items selected yet...</p>}
              {Object.entries(cart).map(([k, qty]) => (
                qty > 0 && (
                  <div key={k} className="flex justify-between">
                    <span>{LABELS[k]} × {qty}</span>
                    <span className="font-semibold">₹{(PRICES[k] * qty).toLocaleString('en-IN')}</span>
                  </div>
                )
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Delivery</span><span>FREE</span>
              </div>
              <div className="flex justify-between font-black text-lg border-t pt-2 mt-2">
                <span>Total (COD)</span>
                <span className="text-purple-700">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Expected Delivery</label>
                <select 
                  value={urgency} 
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-purple-400 outline-none bg-white"
                >
                  <option value="Regular">Regular (1-2 Days)</option>
                  <option value="Urgent">Urgent (Tomorrow Morning)</option>
                  <option value="Very Urgent">Very Urgent (Today ASAP)</option>
                </select>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Billing & Delivery Details</p>
                <p className="text-sm font-semibold text-gray-800">{profileData.shop}</p>
                <p className="text-xs text-gray-500 mt-1">{profileData.addr}</p>
                <p className="text-xs text-gray-500 mt-0.5">{profileData.phone}</p>
                <Link to="/customer/profile" className="text-xs text-purple-600 font-bold mt-2 inline-block hover:underline">
                  Edit Details
                </Link>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black rounded-2xl hover:opacity-90 transition shadow-lg"
            >
              🚀 Place Bulk Order
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">Payment: Cash on Delivery</p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Order Placed!</h2>
            <p className="text-gray-500 text-sm mb-2">Your order has been received by our team.</p>
            <p className="text-gray-500 text-sm mb-6">Our Manager will assign a Delivery Boy shortly.</p>
            <div className="bg-purple-50 rounded-xl p-3 mb-6">
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-black text-purple-700 text-xl">{modalData.id}</p>
            </div>
            <Link 
              to="/customer/track_order"
               className="block w-full py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition"
            >
              📍 Track My Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ icon, title, desc, price, qty, onChange }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow hover:-translate-y-1 transition">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-400">{desc}</p>
      <p className="text-purple-600 font-black text-lg mt-1">₹{price} / carton</p>
      <div className="flex items-center gap-3 mt-3">
        <button 
          onClick={() => onChange(-1)}
          className="w-9 h-9 bg-gray-100 rounded-xl font-bold text-lg hover:bg-red-100 transition"
        >
          −
        </button>
        <span className="font-black text-xl w-8 text-center">{qty}</span>
        <button 
          onClick={() => onChange(1)}
          className="w-9 h-9 bg-gray-100 rounded-xl font-bold text-lg hover:bg-green-100 transition"
        >
          +
        </button>
      </div>
    </div>
  );
}
