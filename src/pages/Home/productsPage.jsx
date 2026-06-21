import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Cart Page එකට Navigate වෙන්න navigation import කලා
import api from "../../utils/api";
import LoadingScreen from "../../Components/loadingScreen";
import ProductCard from "../../Components/ProductCard";
import { FaShoppingCart } from "react-icons/fa"; // 👈 Cart Icon එක සඳහා react-icons පාවිච්චි කලා
import { getCart } from "../../utils/cart"; // 👈 Cart එකේ Items ගණන කියවන්න getCart import කලා

export default function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDropdown, setSelectedDropdown] = useState("All");
    const [searchCategory, setSearchCategory] = useState("All");
    
    // 🛒 Cart Count එක තබා ගන්නා State එක
    const [cartCount, setCartCount] = useState(0);

    // Cart එකේ තියෙන මුළු බඩු ප්‍රමාණය ගණනය කරන ෆන්ක්ෂන් එක
    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(totalItems);
    };

    useEffect(() => {
        // පිටුවට ආපු ගමන් Cart එකේ Count එක අප්ඩේට් කරයි
        updateCartCount();
        
        // වෙනත් තැනකදී Cart එකට බඩු එකතු වුනොත් (cartUpdate event එක හරහා) Count එක එවලේම අප්ඩේට් කරයි
        window.addEventListener("cartUpdate", updateCartCount);
        
        if (loading) {
            const token = localStorage.getItem("Token");
            api.get("/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                setProducts(response.data);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            });
        }

        return () => window.removeEventListener("cartUpdate", updateCartCount);
    }, [loading]);

    const handleSearch = () => {
        setSearchCategory(selectedDropdown);
    };

    const filteredProducts = products.filter((product) => {
        if (searchCategory === "All") {
            return true; 
        }
        return product.category?.toLowerCase() === searchCategory.toLowerCase();
    });

    return (
        <div className="w-full min-h-screen bg-black text-white px-8 pt-24">
            
            {/* 🟦 HEADER SECTION WITH DROPDOWN, SEARCH BUTTON & 🛒 CART ICON */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
                <div>
                    <h1 className="text-white text-3xl font-bold">Products Page</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {searchCategory === "All" 
                            ? "Showing all premium hardware components" 
                            : `Showing results for "${searchCategory}"`}
                    </p>
                </div>

                {/* Dropdown, Search Button සහ Cart Icon එක එක පෙළට */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    
                    {/* 🗂️ Category Dropdown */}
                    <select 
                        value={selectedDropdown} 
                        onChange={(e) => setSelectedDropdown(e.target.value)} 
                        className="h-[46px] min-w-[180px] px-4 bg-[#041024] border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer shadow-md"
                    >
                        <option value="All" className="bg-[#041024] text-white">All Categories</option>
                        <option value="Graphic card" className="bg-[#041024] text-white">Graphic card</option>
                        <option value="Motherboard" className="bg-[#041024] text-white">Motherboard</option>
                        <option value="Cpu" className="bg-[#041024] text-white">Cpu</option>
                        <option value="Ram" className="bg-[#041024] text-white">Ram</option>
                        <option value="Storage" className="bg-[#041024] text-white">Storage</option>
                        <option value="Power supply" className="bg-[#041024] text-white">Power supply</option>
                        <option value="Caseing" className="bg-[#041024] text-white">Caseing</option>
                        <option value="Cooling fan" className="bg-[#041024] text-white">Cooling fan</option>
                        <option value="Key boards" className="bg-[#041024] text-white">Key boards</option>
                        <option value="Mouse" className="bg-[#041024] text-white">Mouse</option>
                        <option value="Laptop" className="bg-[#041024] text-white">Laptop</option>
                        <option value="Monitors" className="bg-[#041024] text-white">Monitors</option>
                        <option value="Chairs" className="bg-[#041024] text-white">Chairs</option>
                        <option value="Tables" className="bg-[#041024] text-white">Tables</option>
                        <option value="Headsets" className="bg-[#041024] text-white">Headsets</option>
                        <option value="Mobiles" className="bg-[#041024] text-white">Mobiles</option>
                        <option value="Consoles" className="bg-[#041024] text-white">Consoles</option>
                        <option value="Tablet PC (Tabs)" className="bg-[#041024] text-white">Tablet PC (Tabs)</option>
                        <option value="Others" className="bg-[#041024] text-white">Others</option>
                    </select>

                    {/* 🔍 Search Button */}
                    <button 
                        onClick={handleSearch}
                        className="h-[46px] px-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                    >
                        🔍 Search
                    </button>

                    {/* 🛒 Shopping Cart Icon Button with Red Badge */}
                    <button 
                        onClick={() => navigate("/cart")} 
                        className="relative h-[46px] w-[46px] bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 rounded-xl transition-all flex items-center justify-center shadow-lg group"
                        title="View Cart"
                    >
                        <FaShoppingCart className="text-xl text-gray-300 group-hover:text-blue-400 transition-colors" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>

                </div>
            </div>

            {/* ⏳ LOADING SCREEN */}
            {loading && <LoadingScreen />}
            
            {/* 📦 PRODUCTS GRID */}
            {!loading && (
                <>
                    {filteredProducts.length > 0 ? (
                        <div className="flex flex-wrap gap-6 max-w-7xl mx-auto py-10">
                            {filteredProducts.map((product) => {
                                return (
                                    <ProductCard key={product._id} product={product} />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full text-center py-20">
                            <h2 className="text-xl text-gray-400 font-semibold">
                                No products found under "{searchCategory}" category.
                            </h2>
                            <button 
                                onClick={() => { setSelectedDropdown("All"); setSearchCategory("All"); }}
                                className="mt-4 text-blue-500 hover:underline text-sm"
                            >
                                Clear filter and view all products
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}