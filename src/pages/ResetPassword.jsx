import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👉 ඉම්පෝර්ට් එක එකතු කරන්න

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const email = location.state?.email || '';

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/reset-password', { email, otp, newPassword });
      
      // 👉 සාර්ථක Password Changed Toast පණිවිඩය
      toast.success(response.data.message || "Password reset successfully.");
      
      navigate('/signin'); 
    } catch (err) {
      
      // 👉 Error Toast පණිවිඩය
      toast.error(err.response?.data?.message || "Something went wrong.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a192f] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#112240] p-8 rounded-xl border border-gray-700 shadow-2xl">
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-gray-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
              placeholder="Enter the OTP sent to email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
              placeholder="Create new password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}