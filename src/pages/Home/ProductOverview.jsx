import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import LoadingScreen from "../../Components/loadingScreen";
import { FaShoppingCart } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa6";

export default function ProductOverview() {
    const { productId } = useParams(); // URL එකෙන් :productId කෑල්ල කියවලා ගන්නවා
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 🌐 ලින්ක් එකෙන් පේජ් එකට ආපු ගමන් URL ID එකෙන් Backend එකෙන් ඩේටා ඇදීම
    useEffect(() => {
        const token = localStorage.getItem("Token");
        
        // ඔයාගේ Backend එකේ එක ප්‍රඩක්ට් එකක් විතරක් ID එකෙන් ගන්න Endpoint එක (උදා: /products/ID)
        api.get(`/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            setProduct(response.data);
            loading && setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching product overview:", error);
            loading && setLoading(false);
        });
    }, [productId, loading]);

    if (loading) return <LoadingScreen />;

    // ප්‍රඩක්ට් එකක් නැත්නම් පෙන්වන මැසේජ් එක
    if (!product) {
        return (
            <div className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-gray-400">Product Not Found!</h2>
                <button onClick={() => navigate("/products")} className="text-blue-500 hover:underline">Back to Products</button>
            </div>
        );
    }

    const images = product?.image || ["/default-product-1.png"];
    const isOutOfStock = product.stock <= 0 || product.isAvailable === false;

    return (
        <div className="w-full min-h-screen bg-black text-white px-6 md:px-16 pt-28 pb-12">
            <div className="max-w-6xl mx-auto">
                
                {/* ⬅️ Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                    ❮ Back to Products
                </button>

                {/* 📦 Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
                    
                    {/* 📸 Left: Image Gallery Area */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-[350px] md:h-[450px] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                            <img 
                                src={images[currentImageIndex]} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-4"
                            />
                            
                            {/* Carousel Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white font-bold">❮</button>
                                    <button onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white font-bold">❯</button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-3 overflow-x-auto py-2">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-900 transition-all ${currentImageIndex === idx ? "border-blue-500 scale-105" : "border-white/10 opacity-60"}`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 📝 Right: Product Details Area */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                                {product.brand || "Premium Brand"}
                            </span>
                            
                            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-2 leading-tight">
                                {product.name}
                            </h1>
                            
                            <p className="text-gray-400 text-xs mb-6">Model: {product.model || "N/A"}</p>

                            {/* Price Tag */}
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-6">
                                <p className="text-gray-400 text-xs mb-1">Price:</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-emerald-400 text-3xl font-black tracking-wide">
                                        LKR {Number(product.price).toLocaleString()}
                                    </span>
                                    {product.labelPrice && (
                                        <span className="text-gray-500 line-through text-sm">
                                            LKR {product.labelPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description Block */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Product Description</h3>
                                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-black/30 p-4 rounded-xl border border-white/5 max-h-48 overflow-y-auto">
                                    {product.description}
                                </p>
                            </div>

                            {/* Stock Indicator */}
                            <div className="flex items-center gap-2 text-sm mb-8">
                                <span className="text-gray-400">Availability:</span>
                                {!isOutOfStock ? (
                                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">In Stock ({product.stock} left)</span>
                                ) : (
                                    <span className="text-red-400 font-bold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* 🛒 Action Buttons (Add to Cart & Buy Now) */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            {/* 🛍️ Add to Cart Button */}
                            <button 
                                disabled={isOutOfStock}
                                className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-300 border active:scale-[0.98] flex items-center justify-center gap-2 ${
                                    !isOutOfStock
                                    ? "border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white"
                                    : "bg-gray-800 border-transparent text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <FaShoppingCart  className="text-white"/> {!isOutOfStock ? "Add to Cart" : "Out of Stock"}
                            </button>

                            {/* ⚡ Buy Now Button */}
                            <button 
                                disabled={isOutOfStock}
                                className={`flex-1 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
                                    !isOutOfStock
                                    ? "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-emerald-900/20"
                                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                             <FaMoneyBillWave /> {!isOutOfStock ? "Buy Now" : "Out of Stock"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}