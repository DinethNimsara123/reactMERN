import { Link, NavLink } from "react-router-dom"; // ⚠️ NavLink එක මෙතනට එකතු කළා

export default function Header() {
    

    return (
        <div className="bg-gradient-to-r from-blue-500 to-green-500 flex items-center w-full h-[100px] bg-amber-700">
            
            
            <Link to="/">
                <img src="/logo.png" alt="Logo" className="w-[300px] h-[200px] w-auto object-cover" />
            </Link>

            <div className="flex ml-80">
                
                {/* 1. Products Link */}
                <NavLink 
                    to="/products" 
                    className={({ isActive }) => 
                        `m-5 pb-1 transition-all duration-300 ${
                            isActive ? "border-b-4 border-black" : "border-b-4 border-transparent"
                        }`
                    }
                >
                    <h1 className="text-white text-2xl font-bold">Products</h1>
                </NavLink>

                {/* 2. Contact Us Link */}
                <NavLink 
                    to="/contact-us" 
                    className={({ isActive }) => 
                        `m-5 pb-1 transition-all duration-300 ${
                            isActive ? "border-b-4 border-black" : "border-b-4 border-transparent"
                        }`
                    }
                >
                    <h1 className="text-white text-2xl font-bold">Contact Us</h1>
                </NavLink>

                {/* 3. About Us Link */}
                <NavLink 
                    to="/about-us" 
                    className={({ isActive }) => 
                        `m-5 pb-1 transition-all duration-300 ${
                            isActive ? "border-b-4 border-black" : "border-b-4 border-transparent"
                        }`
                    }
                >
                    <h1 className="text-white text-2xl font-bold">About Us</h1>
                </NavLink>

            </div>
        </div>
    );
}