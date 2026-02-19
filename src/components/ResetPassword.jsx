import React, { useState } from "react";
import { Lock, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Password reset successful");
      setSubmitted(true);
      // Logic to update password would go here
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center px-4 md:p-4 lg:p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header - Consistent with your Login design */}
        <div className="h-40 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-200">
            <Lock className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="px-8 pb-10">
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold text-center">Reset Password</h1>
              <p className="text-sm text-slate-500 text-center mt-2">
                Almost there! Choose a strong password to secure your account.
              </p>

              <form onSubmit={handleReset} className="mt-8">
                {/* New Password */}
                <div className="mb-5">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <div className="mt-1 relative flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-2 py-3 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                  <div className="mt-1 flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full px-2 py-3 outline-none text-sm"
                    />
                  </div>
                  {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-[0.98]"
                >
                  Update Password
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="flex justify-center mb-4 text-green-500">
                <CheckCircle2 size={60} />
              </div>
              <h2 className="text-xl font-bold">Password Updated!</h2>
              <p className="text-sm text-slate-500 mt-2">
                Your password has been changed successfully. You can now log in with your new credentials.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-semibold shadow-lg transition-all"
              >
                Back to Login
              </button>
            </div>
          )}

          {!submitted && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors"
              >
                <ArrowLeft size={16} />
                Cancel and return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}