import React, { useState } from "react";
import { User, Lock, Shield, Store, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {login} from "./auth";
export default function Login() {
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    let newError = {};
    

    // Validate username
    if (!username.trim()) {
      newError.username = "Username required";
    }

    // Validate password
    if (!password.trim()) {
      newError.password = "Password required";
    } else if (password.length < 6) {
      newError.password = "Password must be at least 6 characters";
    }

    setErrors(newError);

    // If no errors, proceed (for now just log payload)
    if (Object.keys(newError).length === 0) {
      setErrors({}); // Clear previous errors
      login(role)
      const payload = {
        username,
        password,
        role,
        remember,
      };
      console.log("Form valid. Payload:", payload);
      if (role === "admin") {
        navigate("/admin_dashboard");
      } else if (role === "salesman") {
        navigate("/sale_dashboard");
      }
      
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center px-4 md:p-4 lg:p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="h-48 bg-gradient-to-b from-pink-100 to-white flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=600"
            alt="Ice cream"
            className="h-40 object-contain"
          />
        </div>

        <div className="px-6 pb-6">
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
          <p className="text-sm text-slate-500 text-center mt-1">
            Enter your credentials to manage ice cream stocks and orders
          </p>

          {/* Username */}
          <div className="mt-6">
            <label className="text-sm font-medium">
              Username or Mobile Number
            </label>
            <div className="mt-1 flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
              <User className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-2 py-2 outline-none text-sm"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="text-sm font-medium">Password</label>
            <div className="mt-1 relative flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-2 py-2 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="mt-5">
            <label className="text-sm font-medium">Select Your Role</label>
            <div className="mt-2 grid grid-cols-2 gap-2 bg-slate-200 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("admin")}
                aria-selected={role === "admin"}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${
                  role === "admin" ? "bg-blue-500 text-white" : "text-slate-600"
                }`}
              >
                <Shield className="w-4 h-4" /> Admin
              </button>

              <button
                type="button"
                onClick={() => setRole("salesman")}
                aria-selected={role === "salesman"}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${
                  role === "salesman"
                    ? "bg-blue-500 text-white"
                    : "text-slate-600"
                }`}
              >
                <Store className="w-4 h-4" /> Salesman
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <a
  onClick={() => navigate("/forgot-password")}
  className="text-blue-500 hover:underline cursor-pointer"
>
  Forgot password?
</a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="mt-5 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow"
          >
            Login
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">
            Having trouble?{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-500 hover:underline"
            >
              Contact System Admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
