import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function CashierLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center gap-3 py-2.5 px-4 rounded-xl transition font-semibold text-sm ${
      isActive ? 'bg-emerald-600' : 'hover:bg-emerald-600'
    }`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-emerald-700 text-white fixed flex flex-col justify-between z-10 print:hidden">
          <div>
            <div className="p-5 border-b border-emerald-600 flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <h2 className="text-lg font-black">CoolStock</h2>
                <p className="text-xs text-emerald-200">Cashier Panel</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1 px-3">
              <Link to="/cashier/dashboard" className={navLinkClass('/cashier/dashboard')}>
                <span>💳</span> Payment Verification
              </Link>
              <Link to="/cashier/profile" className={navLinkClass('/cashier/profile')}>
                <span>👤</span> My Profile
              </Link>
            </nav>
          </div>
          <div className="mb-5 px-4 mt-4">
            <button
              onClick={handleLogout}
              className="w-full block py-3 px-4 bg-red-600 rounded-xl hover:bg-red-700 transition text-center font-bold text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 w-full print:ml-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
