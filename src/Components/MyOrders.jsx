import { useEffect, useState } from "react";
import api from "../utils/api";
import { FaEnvelope, FaChevronDown, FaChevronUp, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("Token");

        if (token) {
            api.get("/orders/1/100", { 
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then((res) => {
                setOrders(res.data.orders || []);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching orders:", err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleCancelOrder = (orderId) => {
        const token = localStorage.getItem("Token");
        
        if (window.confirm("Are you sure you want to cancel this order? This will update the product stock.")) {
            api.delete(`/orders/customer/${orderId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then((res) => {
                alert(res.data.message);
                setOrders(orders.filter(order => order._id !== orderId));
            })
            .catch((err) => {
                alert(err.response?.data?.message || "Something went wrong!");
            });
        }
    };

    const toggleRow = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060b13] flex items-center justify-center text-white text-lg font-medium">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060b13] p-6 text-white font-sans">
            <div className="max-w-5xl mx-auto mt-6">
                
                <h1 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2">
                    📦 My Orders 
                    <span className="text-sm font-normal text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </span>
                </h1>

                {orders.length === 0 ? (
                    <div className="text-gray-400 text-center py-12 bg-[#0e1622] rounded-xl border border-gray-800 shadow-xl">
                        <p className="text-base font-medium">You haven't placed any orders yet.</p>
                        <p className="text-xs text-gray-500 mt-1">Once you order products, they will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-[#0e1622] rounded-xl shadow-2xl border border-gray-800">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#172337] text-gray-300 uppercase text-xs font-semibold tracking-wider border-b border-gray-800">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Items</th>
                                    <th className="p-4">Total Price</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Message</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <>
                                        {/* Main Row */}
                                        <tr 
                                            key={order._id} 
                                            onClick={() => toggleRow(order._id)}
                                            className={`border-b border-gray-800/60 cursor-pointer transition-colors duration-200 ${
                                                expandedOrderId === order._id ? "bg-[#0d1e36]" : "hover:bg-[#131f32]"
                                            }`}
                                        >
                                            <td className="p-4 font-mono text-xs text-blue-400 font-medium flex items-center gap-2">
                                                {expandedOrderId === order._id ? <FaChevronUp size={10} className="text-gray-500"/> : <FaChevronDown size={10} className="text-gray-500"/>}
                                                #{order._id ? order._id.substring(0, 8) : "N/A"}...
                                            </td>
                                            
                                            <td className="p-4 text-sm text-gray-300">
                                                {order.date ? new Date(order.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : "Pending Date"}
                                            </td>
                                            
                                            <td className="p-4 text-sm text-gray-300">
                                                <span className="bg-gray-800 text-xs px-2.5 py-1 rounded font-medium">
                                                    {order.items?.length || 0} Items
                                                </span>
                                            </td>
                                            
                                            <td className="p-4 text-sm font-semibold text-emerald-400">
                                                LKR {order.totalAmount ? order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                                            </td>
                                            
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                                                    (order.status || "").toLowerCase() === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                    (order.status || "").toLowerCase() === "shipping" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                }`}>
                                                    {order.status || "pending"}
                                                </span>
                                            </td>

                                            {/* Admin Message */}
                                            <td className="p-4 text-center">
                                                {order.adminMessage && order.adminMessage.trim() !== "" ? (
                                                    <button
                                                        onClick={(e) => { 
                                                            e.stopPropagation();
                                                            setSelectedMessage({ 
                                                                orderId: order._id.substring(0, 8), 
                                                                message: order.adminMessage 
                                                            });
                                                        }}
                                                        className="relative inline-flex items-center justify-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 transition-all"
                                                        title="View admin message"
                                                    >
                                                        <FaEnvelope size={14} />
                                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0e1622]"></span>
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-600 text-xs">—</span>
                                                )}
                                            </td>
                                            
                                            {/* Cancel Button */}
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                {(order.status || "").toLowerCase() === "pending" ? (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition shadow-md hover:shadow-rose-600/20 focus:outline-none border border-rose-500/30"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500 text-xs font-medium italic">
                                                        Locked
                                                    </span>
                                                )}
                                            </td>
                                        </tr>

                                        {/* ✅ Expanded Details Row */}
                                        {expandedOrderId === order._id && (
                                            <tr key={order._id + "_expanded"} className="bg-[#071222]">
                                                <td colSpan={7} className="p-5 border-b border-gray-800">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                                                        {/* Shipping Info */}
                                                        <div className="bg-[#0b1a30] p-4 rounded-xl border border-gray-800">
                                                            <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider border-b border-gray-800 pb-2">
                                                                <FaUser /> Shipping Info
                                                            </h3>
                                                            <p className="text-white font-semibold">{order.firstName} {order.lastName}</p>
                                                            <p className="text-gray-400 text-xs mt-1">{order.email}</p>
                                                            <p className="flex items-center gap-2 text-gray-300 font-mono text-sm mt-2">
                                                                <FaPhone className="text-gray-500 text-xs" /> {order.phone}
                                                            </p>
                                                        </div>

                                                        {/* Delivery Address */}
                                                        <div className="bg-[#0b1a30] p-4 rounded-xl border border-gray-800">
                                                            <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider border-b border-gray-800 pb-2">
                                                                <FaMapMarkerAlt /> Delivery Address
                                                            </h3>
                                                            <p className="text-gray-200 text-sm">{order.addressLine1}</p>
                                                            {order.addressLine2 && <p className="text-gray-200 text-sm">{order.addressLine2}</p>}
                                                            <p className="text-white font-bold mt-1">City: {order.city}</p>
                                                        </div>

                                                        {/* Payment Summary */}
                                                        <div className="bg-[#0b1a30] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                                                            <div>
                                                                <h3 className="text-green-400 font-bold mb-3 text-xs uppercase tracking-wider border-b border-gray-800 pb-2">
                                                                    Payment Summary
                                                                </h3>
                                                                <span className="text-xs font-bold bg-amber-600/20 text-amber-400 px-2 py-1 rounded border border-amber-600/30">
                                                                    Cash On Delivery (COD)
                                                                </span>
                                                            </div>
                                                            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-end">
                                                                <span className="text-gray-400 text-xs uppercase font-bold">Total:</span>
                                                                <span className="text-lg font-black text-emerald-400">
                                                                    LKR {order.totalAmount?.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Ordered Items */}
                                                    <div className="bg-[#051229] rounded-xl border border-gray-800 p-4">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                                            Items ({order.items?.length || 0})
                                                        </h4>
                                                        <div className="flex flex-col gap-2">
                                                            {order.items?.map((item, idx) => {
                                                                const prod = item.product || {};
                                                                return (
                                                                    <div key={idx} className="flex items-center justify-between bg-[#091a38] p-3 rounded-lg border border-gray-800/40">
                                                                        <div className="flex items-center gap-3">
                                                                            <img
                                                                                src={Array.isArray(prod.image) ? prod.image[0] : prod.image || "/placeholder.png"}
                                                                                alt={prod.name}
                                                                                className="w-12 h-12 object-cover rounded-md border border-gray-700 bg-[#041024]"
                                                                                onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Product"; }}
                                                                            />
                                                                            <div>
                                                                                <p className="text-blue-400 font-mono text-xs">{prod.productId}</p>
                                                                                <p className="text-white font-semibold text-sm">{prod.name}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-xs text-gray-400">LKR {prod.price?.toLocaleString()}</p>
                                                                            <p className="text-sm font-bold text-amber-400">Qty: {item.qty || 1}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Admin Message Popup */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div className="bg-[#0b1b35] border border-yellow-500/30 w-full max-w-md rounded-2xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-3">
                            <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center">
                                <FaEnvelope size={16} />
                            </div>
                            <div>
                                <h2 className="text-white text-base font-bold">Message from Admin</h2>
                                <p className="text-gray-500 text-xs">Order #{selectedMessage.orderId}...</p>
                            </div>
                        </div>
                        <div className="bg-[#091a38] rounded-xl p-4 border border-gray-800 text-gray-200 text-sm leading-relaxed min-h-[80px]">
                            {selectedMessage.message}
                        </div>
                        <button
                            onClick={() => setSelectedMessage(null)}
                            className="mt-4 w-full py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold transition-all border border-gray-700 text-xs"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}