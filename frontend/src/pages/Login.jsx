import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);

  // Login State
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin"); // Changed from 'admin' to 'Admin'

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

    // 1. Hardcoded Admin Check
    if (
      role === "Admin" &&
      email === "admin2026@gmail.com" &&
      password === "2026"
    ) {
      localStorage.setItem("user", JSON.stringify({ email, role: "Admin" }));
      navigate("/admin/dashboard");
      return;
    } 
    
    // 2. Staff/Customer Login via Backend
    try {
      const res = await axios.post("http://localhost:5000/loginStaff", {
        email,
        password,
        role,
      });

      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess("Login Successful!");

      // Navigation based on Role
      if (user.role === "Manager") navigate("/manager/dashboard");
      else if (user.role === "Cashier") navigate("/cashier/dashboard");
      else if (user.role === "Delivery") navigate("/delivery/dashboard");
      else if (user.role === "Customer") navigate("/customer/shop"); // Assuming path exists
      
    } catch (err) {
      setError(err.response?.data?.msg || "Login Failed. Please check credentials.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Logic to save customer to DB should go here via axios.post("/registerCustomer")
    setSuccess("Registration successful! (Demo: Saved to LocalStorage)");
    setIsRegistering(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center min-h-screen p-4 w-full">
      <div className={`bg-white p-8 rounded-3xl shadow-2xl w-full transition-all duration-300 ${isRegistering ? "max-w-2xl" : "max-w-md"}`}>
        <div className="text-center mb-7">
          <div className="text-5xl mb-2">🍦</div>
          <h1 className="text-3xl font-black text-gray-800">CoolStock</h1>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-5 text-center text-sm font-semibold">⚠️ {error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-5 text-center text-sm font-semibold">✅ {success}</div>}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Email / Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none bg-white"
            >
              <option value="Admin">⚙️ Admin</option>
              <option value="Manager">📊 Manager</option>
              <option value="Delivery">🛵 Delivery Boy</option>
              <option value="Cashier">💳 Cashier</option>
              <option value="Customer">🏪 Customer</option>
            </select>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg mt-2">
              🔐 Login
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              New Customer? <button type="button" onClick={() => setIsRegistering(true)} className="text-purple-600 font-bold underline">Register Shop</button>
            </p>
          </form>
        ) : (
          /* Registration Form remains similar but ensure it calls a real API in production */
          <form onSubmit={handleRegister} className="space-y-4">
             {/* ... register inputs ... */}
             <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold">📝 Register My Shop</button>
             <button type="button" onClick={() => setIsRegistering(false)} className="w-full text-gray-500 text-sm">Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}