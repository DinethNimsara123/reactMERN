import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate එක සර් import කරලා තියෙනවා
import api from "../utils/api";

export default function UserData() {

    const [user, setUser] = useState(null);
    // සර් දාපු selectedOption state එක (මුලින්ම "me" අගය ගන්නවා)
    const [selectedOption, setSelectedOption] = useState("me");
    
    // සර් navigate කරන්න හදපු hook එක
    const navigate = useNavigate();

    useEffect(() => {
        // උඹේ local storage එකේ තියෙන විදිහට "Token" (කැපිටල් T) අරගන්නවා
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
                        <Link to="/register" className="hover:text-gray-300">Register</Link>
                    </div>
                ) : (
                    // සර් අන්තිමටම හදපු select option UI එක
                    <div className="text-white flex items-center">
                        
                        {/* යූසර්ගේ ප්‍රොෆයිල් පික් එක (උඹ හදපු විදිහටම w-10 h-10 ලොකුවට) */}
                        <img 
                            src={user.image} 
                            alt="profile"
                            className="w-10 h-10 rounded-full inline-block mr-1 object-cover"
                        />

                        {/* සර්ගේ onChange ලොජික් එක තියෙන select tag එක - font size සහ padding පමණක් ලොකු කර ඇත */}
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
                                    localStorage.removeItem("Token"); // Token එක අයින් කරනවා
                                    setUser(null); // User state එක clear කරනවා
                                    navigate("/"); // මුල් පිටුවට navigate කරවනවා
                                }
                                
                                // ආපහු මුල් option එකටම සෙට් කරනවා (සර් අන්තිමට දාපු කෑල්ල)
                                setSelectedOption("me");
                            }}
                        >
                            {/* පළවෙනි option එක විදිහට යූසර්ගේ First Name එක පේනවා */}
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