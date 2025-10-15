import React, { useState } from "react";
import { FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signIn({ email, password });
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-white p-4 overflow-hidden">
      <div
        className="
          relative w-full max-w-[420px] 
          bg-white rounded-2xl 
          border border-white/70 
          text-gray-800 
          p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)]
        "
      >
        {/* Admin Icon */}
        <div className="flex justify-center mb-3">
          <FaUserShield className="text-[#E53E3E] w-12 h-12" />
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-center mb-1">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-4 text-[16px]">
          Admin Access • Aura Interiors
        </p>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-[16px] font-medium mb-1 text-gray-700">
              Email
            </label>
            <div className="flex items-center bg-white/70 border border-gray-200 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-[#E53E3E]/60">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                placeholder="admin@aura-interiors.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[16px]"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-[16px] font-medium mb-1 text-gray-700">
              Password
            </label>
            <div className="flex items-center bg-white/70 border border-gray-200 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-[#E53E3E]/60">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[16px]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-[#E53E3E] transition"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between text-[14px] mb-6">
            <label className="flex items-center space-x-1.5 text-gray-600">
              <input
                type="checkbox"
                className="accent-[#E53E3E] w-3.5 h-3.5 rounded-md mr-2"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-[#E53E3E] hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-[#E53E3E] to-[#B91C1C] text-white font-medium py-2.5 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-300 text-sm ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center text-gray-500 text-[13px]">
          <p>
            © {new Date().getFullYear()} Aura Interiors, All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
