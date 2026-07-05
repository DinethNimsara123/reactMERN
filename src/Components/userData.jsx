import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function UserData() {

    const [user, setUser] = useState(null);
    const [selectedOption, setSelectedOption] = useState("me");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("Token"); 

        if (token != null) {
            api.get("/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                setUser(res.data);
            }).catch((err) => {
                console.log(err);
                setUser(null);
            });
        }
    }, []);

    return (
        <>
            {
                user == null ? (
                    <div className="text-white text-[14px] flex gap-2">
                        <Link to="/signin" className="hover:text-gray-300">Login</Link>
                        <span>|</span>
                        <Link to="/signup" className="hover:text-gray-300">Register</Link>
                    </div>
                ) : (
                    <div className="text-white flex items-center">
                        
                        <img 
                            src={user.image} 
                            alt="profile"
                            className="w-10 h-10 rounded-full inline-block mr-1 object-cover"
                        />

                        <select 
                            className="bg-transparent border-b inline-block cursor-pointer focus:outline-none text-lg font-medium py-1 px-2"
                            value={selectedOption}
                            onChange={(e) => {
                                setSelectedOption(e.target.value);

                                if (e.target.value === "settings") {
                                    navigate("/settings");
                                }
                                if (e.target.value === "my-orders") {
                                    navigate("/my-orders");
                                }
                                if (e.target.value === "logout") {
                                    localStorage.removeItem("Token");
                                    setUser(null);
                                    navigate("/");
                                }
                                
                                setSelectedOption("me");
                            }}
                        >
                            <option value="me" className="bg-[#0f172a] text-white text-base">{user.firstName}</option>
                            <option value="settings" className="bg-[#0f172a] text-white text-base">Settings</option>
                            <option value="my-orders" className="bg-[#0f172a] text-white text-base">My Orders</option>
                            <option value="logout" className="bg-[#0f172a] text-white text-red-400 text-base font-medium">Logout</option>
                        </select>

                    </div>
                )
            }
        </>
    );
}