import React, { useState } from "react";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    // Simulate API call
    console.log("Reset link sent to:", email);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center px-4 md:p-4 lg:p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header - Matches Login Style */}
        <div className="h-40 bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-200">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="px-8 pb-10">
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
              <p className="text-sm text-slate-500 text-center mt-2">
                No worries! Enter your email and we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="mt-8">
                <div>
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className={`mt-1 flex items-center border rounded-lg px-3 transition-all ${
                    error ? "border-red-500 ring-1 ring-red-500" : "focus-within:ring-2 focus-within:ring-blue-400"
                  }`}>
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-2 py-3 outline-none text-sm"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                >
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-green-500 font-semibold text-lg">Check your email</div>
              <p className="text-sm text-slate-500 mt-2">
                We've sent a password reset link to <br />
                <span className="font-medium text-slate-800">{email}</span>
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-blue-500 text-sm font-medium hover:underline"
              >
                Didn't get the email? Try again
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}