import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  // Login State
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");

  // Register State
  const [regName, setRegName] = useState("");
  const [regShop, setRegShop] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      role === "admin" &&
      email === "admin2026@gmail.com" &&
      password === "2026"
    ) {
      navigate("/admin/dashboard");
    } else {
      try {
        const res = await axios.post("http://localhost:5000/loginStaff", {
          email,
          password,
          role,
        });

        const user = res.data.user;

        localStorage.setItem("user", JSON.stringify(user));
        setSuccess("login Succefull");

        if (user.role === "Manager") {
          navigate("/manager/dashboard");
        } else if (user.role === "Cashier") {
          navigate("/cashier/dashboard");
        } else if (user.role === "Delivery") {
          navigate("/delivery/dashboard");
        }
      } catch (error) {
        setError(error.response?.data?.msg || "Login Failed");
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // Simulate successful registration and store details in localStorage for the customer profile
    const newCustomerProfile = {
      name: regName,
      shop: regShop,
      email: regEmail,
      phone: regPhone,
      addr: regAddress,
      photo: "",
    };

    localStorage.setItem(
      "cs_profile_cust1",
      JSON.stringify(newCustomerProfile),
    );

    setSuccess("Registration successful! Please login as Customer.");
    setIsRegistering(false);

    // Clear register fields
    setRegName("");
    setRegShop("");
    setRegEmail("");
    setRegPhone("");
    setRegAddress("");

    // Pre-fill login for convenience

    setPassword(regPassword);
    setRole("customer");
    setRegPassword("");
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center min-h-screen p-4 w-full">
      <div
        className={`bg-white p-8 rounded-3xl shadow-2xl w-full transition-all duration-300 ${isRegistering ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="text-center mb-7">
          <div className="text-5xl mb-2">🍦</div>
          <h1 className="text-3xl font-black text-gray-800">CoolStock</h1>
          <p className="text-gray-400 text-sm mt-1">
            Ice Cream Wholesale Management
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-5 text-center text-sm font-semibold transition-all">
            ⚠️ {error}
          </div>
        )}

        {success && !isRegistering && (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-5 text-center text-sm font-semibold transition-all">
            ✅ {success}
          </div>
        )}

        {!isRegistering ? (
          // ================= LOGIN FORM =================
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none bg-white transition"
                >
                  <option value="Admin">⚙️ Admin</option>
                  <option value="Manager">📊 Manager</option>
                  <option value="Delivery">🛵 Delivery Boy</option>
                  <option value="Cashier">💳 Cashier</option>
                  <option value="Customer">🏪 Customer (Shop Owner)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg mt-2"
              >
                🔐 Login
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-gray-500 text-sm">
                New Customer?{" "}
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Register your shop
                </button>
              </p>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-4 text-xs text-gray-400 space-y-1">
              <p className="font-semibold text-gray-500 mb-2">
                🧪 Demo Credentials (all passwords: 1234)
              </p>
              <p>⚙️ admin &nbsp;|&nbsp; 📊 manager &nbsp;|&nbsp; 🛵 delivery</p>
              <p>💳 cashier &nbsp;|&nbsp; 🏪 customer</p>
            </div>
          </>
        ) : (
          // ================= REGISTER FORM =================
          <>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-800">
                🏪 Customer Registration
              </h2>
              <p className="text-gray-500 text-sm">
                Create an account to order ice cream in bulk.
              </p>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh General Store"
                    value={regShop}
                    onChange={(e) => setRegShop(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 94001 11111"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Complete Shop Address
                </label>
                <textarea
                  required
                  rows="2"
                  placeholder="e.g. Village Khari, Dist. Anand"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg mt-4"
              >
                📝 Register My Shop
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Log in
                </button>
              </p>
            </div>
          </>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-purple-500 text-sm hover:underline font-semibold"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
