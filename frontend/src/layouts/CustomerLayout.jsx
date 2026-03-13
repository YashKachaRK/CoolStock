import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `transition font-semibold text-sm ${
      isActive ? 'text-purple-600 border-b-2 border-purple-600 pb-0.5' : 'text-gray-500 hover:text-purple-600'
    }`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Customer Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍦</span>
          <div>
            <span className="text-xl font-black text-gray-800">CoolStock</span>
            <span className="text-xs text-gray-400 ml-2">Customer Portal</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <Link to="/customer/place_order" className={navLinkClass('/customer/place_order')}>
            📦 Place Order
          </Link>
          <Link to="/customer/track_order" className={navLinkClass('/customer/track_order')}>
            📍 Track Orders
          </Link>
          <Link to="/customer/profile" className={navLinkClass('/customer/profile')}>
            👤 My Profile
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-red-200 transition"
        >
          🚪 Logout
        </button>
      </nav>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}
