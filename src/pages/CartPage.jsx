import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, addToCart, getTotal } from "../utils/cart";
import CheckoutModal from "../Components/CheckoutModal"; 

export default function CartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const loadCartDetails = () => {
        setCartItems(getCart());
        setTotal(getTotal());
    };

    useEffect(() => {
        loadCartDetails();
    }, []);

    const handleQtyChange = (product, amount) => {
        addToCart(product, amount);
        loadCartDetails(); 
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setIsModalOpen(true);
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 px-4">
                <div className="text-6xl animate-bounce">🛒</div>
                <h2 className="text-2xl font-bold text-gray-500 tracking-wide text-center">Your Shopping Cart is Empty!</h2>
                <button 
                    onClick={() => navigate("/products")} 
                    className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg active:scale-95"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-black text-white px-4 md:px-16 pt-28 pb-12">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    ❮ Continue Shopping
                </button>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-400 tracking-wide mb-8 flex items-center gap-3">
                        Shopping Cart <span className="text-sm bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-blue-300">{cartItems.length} Items</span>
                    </h1>

                    <div className="flex flex-col gap-4 max-h-[450px] overflow-y-auto pr-2 mb-8 border-b border-white/10 pb-6">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-center justify-between bg-black/40 p-4 rounded-2xl border border-white/5 gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <img 
                                        src={
                                            item.product.images?.[0] || 
                                            (Array.isArray(item.product.image) ? item.product.image[0] : item.product.image) || 
                                            "/default-product-1.png"
                                        } 
                                        alt={item.product.name} 
                                        className="w-16 h-16 object-cover rounded-xl bg-slate-900 border border-white/10 flex-shrink-0" 
                                    />
                                    <div>
                                        <h3 className="font-bold text-sm md:text-base leading-snug">{item.product.name}</h3>
                                        <p className="text-emerald-400 font-extrabold text-sm mt-1">LKR {Number(item.product.price).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                                    <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
                                        <button onClick={() => handleQtyChange(item.product, -1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 font-black">-</button>
                                        <span className="w-8 text-center font-bold text-sm text-gray-200">{item.qty}</span>
                                        <button onClick={() => handleQtyChange(item.product, 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 font-black">+</button>
                                    </div>
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-xs text-gray-500">Subtotal</p>
                                        <p className="font-bold text-sm text-gray-300">LKR {(item.product.price * item.qty).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Estimated Amount:</p>
                            <p className="text-emerald-400 text-3xl font-black tracking-wide">LKR {total.toLocaleString()}</p>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            className="w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                        >
                            💵 Place Bulk Order Now
                        </button>
                    </div>
                </div>
            </div>

            {/* 📦 Checkout Modal */}
            <CheckoutModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // ⚡ මෙතනදී cartItems ටික Map කරලා, image array එකක් ආවොත් string එකක් බවට හරවලා යවනවා (Backend Array error එක නැති කරන්න)
                checkoutItems={cartItems.map(item => ({
                    ...item,
                    product: {
                        ...item.product,
                        image: Array.isArray(item.product.image) ? item.product.image[0] : (item.product.image || "/default-product-1.png")
                    }
                }))} 
                totalAmount={total}
                // ⚡ ඕඩර් එක සාර්ථක වුණාම කෙළින්ම Products පිටුවට Navigate වෙන ලොජික් එක
                onSuccess={() => {
                    localStorage.setItem("cart", "[]"); // Cart එක හිස් කරනවා
                    window.dispatchEvent(new Event("cartUpdate")); // Header count එක update කරනවා
                    navigate("/products"); // 👈 මෙතන /orders වෙනුවට /products දාලා හැදුවා!
                }}
            />
        </div>
    );
}