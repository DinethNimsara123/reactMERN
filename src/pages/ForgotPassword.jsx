import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👉 ඉම්පෝර්ට් එක එකතු කරන්න

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/forgot-password', { email });
      
      // 👉 සාර්ථක Toast පණිවිඩය
      toast.success(response.data.message || "OTP sent to your email successfully.");
      
      navigate('/reset-password', { state: { email } });
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
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">Forgot Password</h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your registered email address to receive a password reset OTP.
        </p>
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0a192f] border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
              placeholder="Enter your email address"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}