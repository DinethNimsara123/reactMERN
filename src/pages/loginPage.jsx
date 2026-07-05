import { MdEmail, MdOutlineKey } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
        console.log("Google Login Success:", response);
        try {
            const res = await api.post("/users/google-login", {
                accessToken: response.access_token
            });
            console.log("Backend Google Login Response:", res.data);
            toast.success("Google Login Successful! 🎉");
            localStorage.setItem("Token", res.data.token);
            if (res.data.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error("Backend Google Login Error:", err);
            toast.error("Google Login Failed! ❌");
        }
    },
    onError: (error) => {
        console.error("Google Login Error:", error);
        toast.error("Google Login Failed! ❌");
    }
});

    async function handleLogin(e) {
        e.preventDefault(); 
        setLoading(true);
        toast.loading("Signing in...", { id: "loginToast" });

        try{ 
            const res = await api.post("/users/login", { 
                email: email,
                password: password
            });

            console.log("Login Response:", res.data);
            toast.success("Login Successful!", { id: "loginToast" });
            localStorage.setItem("Token", res.data.token);

            if (res.data.role === "Admin" || res.data.isAdmin === true) {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch(err){
            console.error("Login Error:", err);
            const errorMsg = err?.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(errorMsg, { id: "loginToast" });
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="w-full h-screen bg-[url('/loginBg.jpg')] bg-cover bg-no-repeat flex justify-center items-center">
            <form onSubmit={handleLogin} className="w-[400px] h-[600px] backdrop-blur-md shadow-2xl shadow-black rounded-3xl flex-col p-8 flex justify-center">
                <h1 className="text-white font-bold text-5xl text-center mb-10">Login</h1>
                
                <div className="w-full mb-6">
                    <label className="font-bold text-white flex items-center gap-2"> <MdEmail /> Email </label>
                    <input 
                        className="text-white w-full border-b bg-transparent py-2 focus:outline-none mt-2 transition transform hover:scale-105 focus:scale-105" 
                        type="email" 
                        placeholder="Enter your Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>

                <div className="mb-4">
                    <label className="font-bold text-white flex items-center gap-2"> <MdOutlineKey /> Password </label>
                    <div className="relative">
                        <input 
                            className="text-white w-full border-b bg-transparent py-2 pr-8 focus:outline-none mt-2 transition transform hover:scale-105 focus:scale-105" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <span 
                            className="absolute right-2 bottom-2 cursor-pointer text-gray-400 hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <p className="text-white font-light text-xs mt-2">Forget your password? click <Link to="/forget-password" className="underline text-blue-400 ml-1">Here</Link> </p>
                
                <div>
                    <button disabled={loading} type="submit" className="w-full h-[50px] bg-blue-700 text-amber-50 font-semibold rounded-xl mt-8 active:bg-blue-950 transition cursor-pointer flex justify-center items-center">
                        {loading ? "Loading..." : "Login"}
                    </button> 
                </div>

                <p className="text-white font-light text-xs mt-4">Don't have an account? click <Link to="/signup" className="underline text-blue-400 ml-1">Register Here</Link> </p>
                
                <button type="button" onClick={googleLogin} className="w-full h-[50px] bg-white text-black rounded-xl mt-6 active:bg-amber-100 transition flex justify-center items-center cursor-pointer text-xs font-semibold">
                    <FcGoogle className="mr-2 text-2xl" /> Sign In With Google
                </button>
            </form> 
        </div>
    )
}