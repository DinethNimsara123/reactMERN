import { useState } from "react";
import api from "../utils/api"; 
import { toast } from "react-hot-toast";

export default function CheckoutModal({ isOpen, onClose, checkoutItems, totalAmount, onSuccess }) {
    const [isPlacing, setIsPlacing] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        phone: "",
    });

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails({ ...shippingDetails, [name]: value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsPlacing(true);

        const token = localStorage.getItem("Token"); 

        const finalOrderData = {
            firstName: shippingDetails.firstName,
            lastName: shippingDetails.lastName,
            addressLine1: shippingDetails.addressLine1,
            addressLine2: shippingDetails.addressLine2,
            city: shippingDetails.city,
            phone: shippingDetails.phone,
            totalAmount: totalAmount,
            items: checkoutItems,
        };

        try {
            await api.post("/orders", finalOrderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            toast.success("Order Placed Successfully! ⚡🎉");
            
            // ⚡ ඕඩර් එක ගිය නිසා Local Storage එකේ තියෙන cart එක clear කරනවා
            localStorage.setItem("cart", "[]");
            window.dispatchEvent(new Event("cartUpdate"));
            
            // ⚡ ඊටපස්සේ CartPage එකෙන් දීපු onSuccess() එක (navigate("/products")) රන් කරනවා
            if (onSuccess) {
                onSuccess(); 
            }
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to place order. ❌");
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-white">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <h3 className="text-xl font-bold text-blue-400">Delivery Information 🚚</h3>
                    <button onClick={onClose} className="text-gray-400 text-2xl hover:text-red-500 transition-colors">&times;</button>
                </div>

                <div className="bg-white/5 p-3 rounded-xl mb-4 text-sm border border-white/5">
                    <p className="text-gray-400">Total Items: <span className="text-white font-bold">{checkoutItems.length}</span></p>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">Total: LKR {totalAmount.toLocaleString()}</p>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4 text-left">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">First Name</label>
                            <input type="text" name="firstName" required value={shippingDetails.firstName} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Last Name</label>
                            <input type="text" name="lastName" required value={shippingDetails.lastName} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Address Line 1</label>
                        <input type="text" name="addressLine1" required value={shippingDetails.addressLine1} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Address Line 2 (Optional)</label>
                        <input type="text" name="addressLine2" value={shippingDetails.addressLine2} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">City</label>
                            <input type="text" name="city" required value={shippingDetails.city} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                            <input type="text" name="phone" required value={shippingDetails.phone} onChange={handleInputChange} className="w-full mt-1 p-2.5 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} disabled={isPlacing} className="w-1/3 bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-bold hover:bg-white/10 transition">Cancel</button>
                        <button type="submit" disabled={isPlacing} className="w-2/3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-blue-500 hover:to-emerald-500 transition shadow-lg flex items-center justify-center">
                            {isPlacing ? "Processing..." : "Confirm & Place Order ⚡"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}