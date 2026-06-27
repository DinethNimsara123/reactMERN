import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { MdEmail, MdPerson, MdLock } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
        try {
            const res = await api.post("/users/google-login", {
                accessToken: response.access_token
            });
            toast.success("Google Login Successful! 🎉");
            localStorage.setItem("Token", res.data.token);

            if (res.data.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error("Google Sign Up Failed! ❌");
        }
    },
    onError: () => {
        toast.error("Google Sign Up Failed! ❌");
    }
});

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post("/users", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
      });

      if (res.data.message === "user created successfully") {
        toast.success("Account Created Successfully! 🔥");
        navigate("/signin"); // 👈 සබ්මිට් වුණාම හරියටම Signin (Login) පේජ් එකට යවනවා
      } else if (res.data.message === "already exists") {
        toast.error("User already exists with this email!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration Failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/rejisterPageImage.png')] bg-cover bg-center bg-no-repeat flex justify-end items-center pr-10 sm:pr-20">
      
      {/* 🚀 Rotating Border Box */}
      <div className="animate-glow-border p-[2px] rounded-[40px] shadow-2xl">
        
        {/* Form Container */}
        <div className="w-[400px] bg-black/60 backdrop-blur-xl p-10 rounded-[38px] flex flex-col">
          <h1 className="text-white font-bold text-4xl text-center mb-2">Register</h1>
          <p className="text-blue-400 text-center text-xs mb-8 uppercase tracking-widest">Create Your Account</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="text-white text-xs font-semibold ml-1 flex items-center gap-2"> <MdPerson /> First Name</label>
              <input 
                className="w-full bg-transparent border-b border-gray-500 text-white py-2 px-1 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                type="text" 
                placeholder="Enter First Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-white text-xs font-semibold ml-1 flex items-center gap-2"> <MdPerson /> Last Name</label>
              <input 
                className="w-full bg-transparent border-b border-gray-500 text-white py-2 px-1 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                type="text" 
                placeholder="Enter Last Name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white text-xs font-semibold ml-1 flex items-center gap-2"> <MdEmail /> Email</label>
              <input 
                className="w-full bg-transparent border-b border-gray-500 text-white py-2 px-1 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                type="email" 
                placeholder="Enter Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password with Eye Icon Toggle */}
            <div>
              <label className="text-white text-xs font-semibold ml-1 flex items-center gap-2"> <MdLock /> Password</label>
              <div className="relative">
                <input 
                  className="w-full bg-transparent border-b border-gray-500 text-white py-2 pl-1 pr-8 focus:outline-none focus:border-blue-500 transition-all text-sm" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span 
                  className="absolute right-1 bottom-2 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-[50px] bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl font-bold mt-6 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/40 cursor-pointer"
            >
              {loading ? "Creating Account..." : "REGISTER NOW"}
            </button>
                      
                <button type="button" onClick={googleLogin  } className="w-full h-[50px] bg-white text-black rounded-xl mt-6 active:bg-amber-100 transition flex justify-center items-center cursor-pointer text-xs font-semibold">
                    <FcGoogle className="mr-2 text-2xl" /> Sign Up With Google
                </button>



          </form>

          <p className="text-gray-400 text-center text-xs mt-6">
            Already have an account? 
            {/* 👈 ලොගින් වන ලින්ක් එක හරියටම /signin වෙත යොමු කර ඇත */}
            <Link to="/signin" className="text-blue-500 underline ml-2 hover:text-blue-300">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}