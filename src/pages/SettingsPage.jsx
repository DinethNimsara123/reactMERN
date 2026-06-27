import { useState, useEffect } from "react";
import api from "../utils/api"; 
import uploadMedia from "../utils/mediaUpload"; 
import { toast } from "react-hot-toast"; 
import { FaUser, FaEnvelope, FaLock, FaCamera, FaCheckCircle, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [imageFile, setImageFile] = useState(null); 
    const [imagePreview, setImagePreview] = useState("/default-profile.png"); 
    
    // Password visibility states වෙන වෙනම පාලනය කිරීම
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Profile Data State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
    
    // Password State (පරණ, අලුත් සහ confirm password සඳහා)
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [systemRoles, setSystemRoles] = useState({
        isAdmin: false,
        isEmailVerified: false
    });

    // 1. පේජ් එක ලෝඩ් වෙද්දී යූසර් විස්තර ඇද ගැනීම
    useEffect(() => {
        const token = localStorage.getItem("Token");
        if (token) {
            api.get("/users/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setFormData({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || ""
                });
                setSystemRoles({
                    isAdmin: res.data.isAdmin,
                    isEmailVerified: res.data.isEmailVerified
                });
                setImagePreview(res.data.image || "/default-profile.png"); 
                setFetching(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load profile data");
                setFetching(false);
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // 2. ෆොටෝ preview එක වෙනස් කිරීම
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    // 3. Profile Details සුරැකීම (නම, ඊමේල්, ෆොටෝ)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("Token");
        let finalImageUrl = imagePreview; 

        try {
            if (imageFile) {
                toast.loading("Uploading image to Supabase...", { id: "uploading" });
                finalImageUrl = await uploadMedia(imageFile); 
                toast.dismiss("uploading");
            }

            const payload = {
                ...formData,
                image: finalImageUrl
            };

            const res = await api.put("/users/profile", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Profile Updated Successfully! 🔥");
            
            if (res.data.token) {
                localStorage.setItem("Token", res.data.token);
                window.dispatchEvent(new Event("storage")); 
            }
        } catch (err) {
            toast.dismiss("uploading");
            toast.error(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // 4. Password වෙනස් කිරීමේ ක්‍රියාවලිය (Backend Verification)
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setPwdLoading(true);
        const token = localStorage.getItem("Token");

        try {
            const res = await api.post("/users/change-password", passwordData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(res.data.message || "Password updated successfully!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Failed to update password.";
            toast.error(errorMsg);
        } finally {
            setPwdLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-28 pb-12 px-4 sm:px-8 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-black to-black">
            
            {/* Grid Layout එක: වම් පැත්තට Profile සහ දකුණු පැත්තට Password කොටුව */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 👤 වම් පැත්තේ Profile Details Form */}
                <div className="lg:col-span-7 bg-[#111827]/40 backdrop-blur-xl border border-gray-800/80 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
                            <div className="relative">
                                <img 
                                    src={imagePreview} 
                                    alt="Profile" 
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#1f2937] shadow-2xl"
                                    onError={(e) => { e.target.src = "/default-profile.png"; }} 
                                />
                                <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                                    <FaCamera className="text-xl mb-1 text-blue-400" />
                                    <span>Change Photo</span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold mt-3 text-gray-200">{formData.firstName} {formData.lastName}</h2>
                        <span className="text-xs text-gray-500 mt-1 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                            {systemRoles.isAdmin ? "DN Store Admin" : "DN Store Customer"}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">First Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaUser /></span>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full h-[46px] pl-10 pr-4 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white shadow-inner" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Last Name</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaUser /></span>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full h-[46px] pl-10 pr-4 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white shadow-inner" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaEnvelope /></span>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full h-[46px] pl-10 pr-4 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-white shadow-inner" />
                            </div>
                        </div>

                        <div className="bg-[#111827]/60 border border-gray-800/80 p-4 rounded-xl space-y-3 mt-6 text-xs text-gray-400">
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500" /> Email Verification Status</span>
                                <span className={`px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[10px] ${systemRoles.isEmailVerified ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900" : "bg-amber-950/40 text-amber-400 border border-amber-900"}`}>
                                    {systemRoles.isEmailVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-2"><FaShieldAlt className="text-blue-500" /> Account Security Level</span>
                                <span className="bg-blue-950/40 text-blue-400 border border-blue-900 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[10px]">
                                    {systemRoles.isAdmin ? "Administrator" : "Standard User"}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full h-[48px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "Save Profile Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 🔐 දකුණු පැත්තේ Change Password Form (ඇස් ලාංඡන සහිතයි) */}
                <div className="lg:col-span-5 bg-[#111827]/40 backdrop-blur-xl border border-gray-800/80 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    
                    <h3 className="text-lg font-bold text-amber-400 mb-6 text-center tracking-wide">CHANGE PASSWORD</h3>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-5 text-xs">
                        
                        {/* Current Password Field */}
                        <div>
                            <label className="block text-gray-400 font-semibold mb-2 uppercase tracking-wider">Current Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaLock /></span>
                                <input 
                                    type={showOldPassword ? "text" : "password"} 
                                    name="oldPassword" 
                                    required 
                                    value={passwordData.oldPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="••••••••••••" 
                                    className="w-full h-[46px] pl-10 pr-12 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-white shadow-inner" 
                                />
                                <span 
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer text-gray-500 hover:text-amber-400"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                >
                                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label className="block text-gray-400 font-semibold mb-2 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaLock /></span>
                                <input 
                                    type={showNewPassword ? "text" : "password"} 
                                    name="newPassword" 
                                    required 
                                    value={passwordData.newPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="••••••••••••" 
                                    className="w-full h-[46px] pl-10 pr-12 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-white shadow-inner" 
                                />
                                <span 
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer text-gray-500 hover:text-amber-400"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm New Password Field */}
                        <div>
                            <label className="block text-gray-400 font-semibold mb-2 uppercase tracking-wider">Confirm New Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500"><FaLock /></span>
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    name="confirmPassword" 
                                    required 
                                    value={passwordData.confirmPassword} 
                                    onChange={handlePasswordChange} 
                                    placeholder="••••••••••••" 
                                    className="w-full h-[46px] pl-10 pr-12 bg-[#030712]/80 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-white shadow-inner" 
                                />
                                <span 
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer text-gray-500 hover:text-amber-400"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={pwdLoading} className="w-full h-[48px] bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                                {pwdLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}