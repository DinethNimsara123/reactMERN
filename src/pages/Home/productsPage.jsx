import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import LoadingScreen from "../../Components/loadingScreen";
import ProductCard from "../../Components/ProductCard";
import { FaShoppingCart } from "react-icons/fa";
import { getCart } from "../../utils/cart";

export default function ProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 👉 UI පාලනය සඳහා අලුතින් එකතු වූ සහ වෙනස් වූ State ටික
    const [selectedDropdown, setSelectedDropdown] = useState("All");
    const [searchCategory, setSearchCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(""); // නම ගහලා සර්ච් කරන වචනය
    const [appliedSearch, setAppliedSearch] = useState(""); // Search බොත්තම එබූ පසු ක්‍රියාත්මක වන වචනය
    
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        setCartCount(totalItems);
    };

    useEffect(() => {
        updateCartCount();
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

    // 👉 Search බොත්තම් ක්‍රියාත්මක වන ආකාරය
    const handleCategorySearch = () => {
        setSearchCategory(selectedDropdown);
    };

    const handleNameSearch = () => {
        setAppliedSearch(searchQuery);
    };

    const handleClearFilters = () => {
        setSelectedDropdown("All");
        setSearchCategory("All");
        setSearchQuery("");
        setAppliedSearch("");
    };

    // 👉 නම සහ කැටගරි දෙකම එකට පෙරහන් (Filter) වන ආකාරය
    const filteredProducts = products.filter((product) => {
        // 1. නම හරහා ෆිල්ටර් වීම
        const matchesName = product.name?.toLowerCase().includes(appliedSearch.toLowerCase());
        
        // 2. කැටගරි හරහා ෆිල්ටර් වීම
        const matchesCategory = searchCategory === "All" || product.category?.toLowerCase() === searchCategory.toLowerCase();

        return matchesName && matchesCategory;
    });

    return (
        <div className="w-full min-h-screen bg-black text-white px-8 pt-24">
            
            {/* 🟦 HEADER SECTION WITH SEARCH BARS & CART ICON */}
            <div className="max-w-7xl mx-auto border-b border-white/10 pb-6 mb-6 gap-6">
                
                {/* උඩ පේළිය: ටයිටේල් එක සහ ක，ට් අයිකන් එක */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-white text-3xl font-bold">Products Page</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {searchCategory === "All" && appliedSearch === "" 
                                ? "Showing all premium hardware components" 
                                : `Showing filtered premium hardware components`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
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

                {/* 👉 මැද පේළිය: නම ගහලා සර්ච් කරන දිග බාර් එක සහ කැටගරි සර්ච් ඩ්‍රොප්ඩවුන් එක */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#041024] p-4 rounded-2xl border border-white/5 shadow-xl">
                    
                    {/* දිගු ප්‍රඩක්ට් නේම් සර්ච් බාර් එක (මැදින් දිස්වේ) */}
                    <div className="flex items-center gap-3 w-full md:flex-1 h-[46px] bg-[#0a192f] px-4 rounded-xl border border-gray-600 focus-within:border-blue-500 transition-all">
                        <span className="text-gray-400 text-base">📦</span>
                        <input 
                            type="text" 
                            placeholder="Search products by name..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent text-white text-sm w-full focus:outline-none"
                        />
                        <button 
                            onClick={handleNameSearch}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs rounded-lg transition-all"
                        >
                            Search
                        </button>
                    </div>

                    {/* Category Search Dropdown කොටස (දකුණු පසින් හෝ වෙනම දිස්වේ) */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">CATEGORY SEARCH:</span>
                        <select 
                            value={selectedDropdown} 
                            onChange={(e) => setSelectedDropdown(e.target.value)} 
                            className="h-[46px] min-w-[160px] px-3 bg-[#041024] border border-gray-600 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
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
                        <button 
                            onClick={handleCategorySearch}
                            className="h-[46px] px-4 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-semibold text-xs rounded-xl transition-all"
                        >
                            Apply
                        </button>
                    </div>

                </div>
            </div>

            {/* Clear Filter Button */}
            {(searchCategory !== "All" || appliedSearch !== "") && (
                <div className="max-w-7xl mx-auto mb-6 flex justify-end">
                    <button 
                        onClick={handleClearFilters}
                        className="text-red-400 hover:underline text-xs font-semibold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
                    >
                        ❌ Clear All Filters
                    </button>
                </div>
            )}

            {/* ⏳ LOADING SCREEN */}
            {loading && <LoadingScreen />}
            
            {/* 📦 PRODUCTS GRID */}
            {!loading && (
                <>
                    {filteredProducts.length > 0 ? (
                        <div className="flex flex-wrap gap-6 max-w-7xl mx-auto py-6">
                            {filteredProducts.map((product) => {
                                return (
                                    <ProductCard key={product._id} product={product} />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full text-center py-20">
                            <h2 className="text-xl text-gray-400 font-semibold">
                                No products found matching your criteria.
                            </h2>
                            <button 
                                onClick={handleClearFilters}
                                className="mt-4 text-blue-500 hover:underline text-sm"
                            >
                                Clear filters and view all products
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}