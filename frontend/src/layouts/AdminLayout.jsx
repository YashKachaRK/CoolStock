import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 py-2.5 px-4 rounded-xl transition font-semibold text-sm ${
      isActive ? 'bg-slate-700' : 'hover:bg-slate-700'
    }`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-slate-800 text-white fixed flex flex-col justify-between overflow-y-auto z-10">
          <div>
            <div className="p-5 border-b border-slate-700 flex items-center gap-3">
              <span className="text-2xl">🍦</span>
              <div>
                <h2 className="text-lg font-black">CoolStock</h2>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1 px-3">
              <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-2 pb-1">Overview</p>
              <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                <span>🏠</span> Dashboard
              </Link>
              
              <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-4 pb-1">Management</p>
              <Link to="/admin/view_products" className={navLinkClass('/admin/view_products')}>
                <span>📦</span> Manage Products
              </Link>
              <Link to="/admin/recent_orders" className={navLinkClass('/admin/recent_orders')}>
                <span>🧾</span> Recent Orders
              </Link>
              <Link to="/admin/view_employees" className={navLinkClass('/admin/view_employees')}>
                <span>👥</span> Manage Staff
              </Link>
              <Link to="/admin/view_customers" className={navLinkClass('/admin/view_customers')}>
                <span>🏪</span> Manage Customers
              </Link>
              
              <p className="text-xs text-slate-500 uppercase font-bold px-3 pt-4 pb-1">Account</p>
              <Link to="/admin/profile" className={navLinkClass('/admin/profile')}>
                <span>👤</span> My Profile
              </Link>
            </nav>
          </div>
          <div className="mb-5 px-4 pb-2 mt-4">
            <button
              onClick={handleLogout}
              className="w-full block py-3 px-4 bg-red-600 rounded-xl hover:bg-red-700 transition text-center font-bold text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
