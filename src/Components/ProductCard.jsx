import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const images = product?.image || ["/default-product-1.png"];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            {/* Main Product Card */}
            <div className="w-72 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                
                {/* Image Section */}
                <div className="relative w-full h-64 bg-slate-950 flex items-center justify-center group overflow-hidden border-b border-white/10">
                    <img 
                        src={images[currentImageIndex]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />

                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">❮</button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">❯</button>

                    <div className="absolute bottom-3 flex gap-1.5 justify-center w-full z-10">
                        {images.map((_, index) => (
                            <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === index ? "w-4 bg-blue-500" : "w-1.5 bg-white/50"}`} />
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                        <span>{product.brand || "Brand"}</span>
                        <span className="text-gray-400 text-[10px] normal-case">{product.model || ""}</span>
                    </div>

                    <h1 className="text-white font-bold text-lg line-clamp-1 mb-3" title={product.name}>
                        {product.name}
                    </h1>

                    <div className="flex flex-col gap-0.5 mb-3">
                        {product.labelPrice && (
                            <span className="text-gray-400 text-xs line-through opacity-70">
                                LKR {product.labelPrice.toLocaleString()}
                            </span>
                        )}
                        <span className="text-emerald-400 text-2xl font-extrabold tracking-wide">
                            LKR {Number(product.price).toLocaleString()}
                        </span>
                    </div>

                    {/* 📦 View Details & Order Now Button */}
                    <button 
                        onClick={() => {
                            console.log("Product Data Clicked:", product); 
                            
                            // 🎯 සර්ගේ Backend එකට ගැලපෙන්න productId එක විතරක් මෙතනින් වෙනස් කළා:
                            const id = product.productId; 
                            
                            navigate(`/overview/${id}`);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg border border-blue-500/30 transition-all duration-200 active:scale-95 mb-4 shadow-md"
                    >
                        📦 View Details & Order Now
                    </button>

                    <div className="mt-auto border-t border-white/5 pt-3 flex justify-between items-center">
                        <span className="text-gray-400 text-xs">Available Stock: {product.stock}</span>
                        {product.stock > 0 && product.isAvailable !== false ? (
                            <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">● In Stock</span>
                        ) : (
                            <span className="bg-red-500/20 text-red-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-red-500/30">● Out of Stock</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#0d1b3e] border border-white/20 rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 text-white">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold">✕</button>
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">Product Specifications</span>
                        <h2 className="text-xl font-bold mb-4 pr-6 border-b border-white/10 pb-2">{product.name}</h2>
                        <div className="max-h-60 overflow-y-auto text-gray-300 text-sm leading-relaxed pr-2">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-5 rounded-xl">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}