import { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
  FaChevronDown, FaChevronUp, FaPhone, FaMapMarkerAlt, FaUser, 
  FaTrashAlt, FaExclamationTriangle, FaCheckSquare, FaSquare,
  FaCommentDots // <- මැසේජ් පැනල් එක ඕපන් කරන්න අලුතින් අයිකන් එකක් ගත්තා
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import toast from "react-hot-toast";
import LoadingScreen from "../../Components/loadingScreen";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // 📦 localStorage packed orders load
  const [packedOrders, setPackedOrders] = useState(() => {
    const savedPackedOrders = localStorage.getItem("admin_packed_orders");
    return savedPackedOrders ? JSON.parse(savedPackedOrders) : {};
  });

  // 🚨 Delete Confirm Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // 💬 Message Modal States (අලුතින් එකතු කළා)
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [selectedOrderForMsg, setSelectedOrderForMsg] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    if (loading) {
      const token = localStorage.getItem("Token");

      api.get("/orders/1/100", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const fetchedOrders = res.data.orders || res.data || [];
        const sortedOrders = fetchedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
        setOrders(sortedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        loading(false);
        setLoading(false);
      });
    }
  }, [loading]);

  useEffect(() => {
    localStorage.setItem("admin_packed_orders", JSON.stringify(packedOrders));
  }, [packedOrders]);

  const toggleRow = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const togglePackedOrder = (orderId, e) => {
    e.stopPropagation();
    setPackedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // --- 📈 CHART DATA CALCULATION ---
  const orderStatuses = ["pending", "shipping", "delivered"];
  const counts = orderStatuses.map((status) => {
    return orders.filter(
      (item) => (item.status || "").trim().toLowerCase() === status.trim().toLowerCase()
    ).length;
  });

  const maxValue = Math.max(...counts, 1);

  const data = {
    labels: ["Pending", "Shipping", "Delivered"],
    datasets: [
      {
        data: counts,
        backgroundColor: ["#f59e0b", "#3b82f6", "#10b981"],
        borderRadius: 10,
        borderSkipped: false,
        barThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        color: "#ffffff",
        anchor: "end",
        align: "top",
        offset: 4,
        font: { size: 14, weight: "bold" },
      },
    },
    scales: {
      x: { ticks: { color: "white", font: { size: 12, weight: "bold" } }, grid: { display: false } },
      y: { beginAtZero: true, max: maxValue + (maxValue * 0.15), ticks: { display: false }, grid: { display: false } },
    },
  };

  // --- ⚡ STATUS UPDATE FUNCTION ---
  const handleStatusChange = async (orderId, newStatus) => {
    const toastId = toast.loading("Updating status in database...");
    try {
      const token = localStorage.getItem("Token");

      const targetOrder = orders.find(o => o._id === orderId);
      const backendOrderId = targetOrder?.orderId;

      if (!backendOrderId) {
        toast.error("Order Custom ID not found!", { id: toastId });
        return;
      }

      await api.put(`/orders/update-status/${backendOrderId}`, { 
        status: newStatus.toLowerCase() 
      }, {
        headers: { Authorization: "Bearer " + token }
      });

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus.toLowerCase() } : order
        )
      );

      toast.success(`Status updated to ${newStatus.toUpperCase()}!`, { id: toastId });
    } catch (err) {
      console.error("Backend update error:", err);
      const errorMsg = err.response?.data?.message || "Error updating status. Check Admin permissions!";
      toast.error(errorMsg, { id: toastId });
    }
  };

  // --- 💬 OPEN MESSAGE POP-UP MODAL ---
  const triggerMessageModal = (order, e) => {
    e.stopPropagation(); // Row එක expand වෙන එක නවත්තන්න
    setSelectedOrderForMsg(order);
    setTypedMessage(order.adminMessage || ""); // කලින් ඩේටාබේස් එකේ මැසේජ් එකක් තිබ්බොත් ඒක බොක්ස් එකට ගන්නවා
    setShowMsgModal(true);
  };

  // --- 💬 SAVE / UPDATE / DELETE MESSAGE IN DATABASE ---
  const handleSaveMessage = async () => {
    if (!selectedOrderForMsg) return;

    const toastId = toast.loading("Saving message to database...");
    try {
      const token = localStorage.getItem("Token");
      const backendOrderId = selectedOrderForMsg.orderId;

      if (!backendOrderId) {
        toast.error("Order Custom ID not found!", { id: toastId });
        return;
      }

      // අපි අලුතින් හදපු වෙනම PUT Route එකට රික්වෙස්ට් එක යවනවා
      await api.put(`/orders/update-message/${backendOrderId}`, {
        adminMessage: typedMessage // ටෙක්ස්ට් එක හිස් කරලා යැව්වොත් Backend එකෙන් auto ඩිලීට් වෙනවා
      }, {
        headers: { Authorization: "Bearer " + token }
      });

      // Frontend state එක අප්ඩේට් කරනවා (ලිස්ට් එකට අලුත් මැසේජ් එක දානවා)
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === selectedOrderForMsg._id ? { ...order, adminMessage: typedMessage } : order
        )
      );

      toast.success(typedMessage === "" ? "Message deleted!" : "Message updated successfully!", { id: toastId });
      setShowMsgModal(false);
      setSelectedOrderForMsg(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save message", { id: toastId });
    }
  };

  // --- 🗑️ OPEN DELETE MODAL ---
  const triggerDeleteConfirm = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  // --- 🗑️ CONFIRMED DELETE FUNCTION ---
  const handleConfirmedDelete = async () => {
    if (!orderToDelete) return;

    try {
      const token = localStorage.getItem("Token");
      toast.loading("Deleting order...");

      await api.delete(`/orders/${orderToDelete}`, {
        headers: { Authorization: "Bearer " + token }
      });

      setPackedOrders((prev) => {
        const updated = { ...prev };
        delete updated[orderToDelete];
        return updated;
      });

      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderToDelete));

      toast.dismiss();
      toast.success("Order deleted successfully!");
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      toast.dismiss();
      toast.error("Error deleting order");
      console.error(err);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#041024] p-6 text-sm text-gray-200 overflow-y-auto relative">
      {loading && <LoadingScreen />}
      
      {/* 📊 Summary Dashboard Chart */}
      <div className="w-full max-w-[1400px] h-[300px] mx-auto bg-[#0d1b35] rounded-2xl p-4 shadow-2xl border border-blue-950 mb-6">
        <h1 className="text-white text-lg font-bold text-center mb-2">
          Order Summary Dashboard
        </h1>
        <div className="h-[210px]">
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* 📋 Orders Table Area */}
      <div className="w-full max-w-[1400px] mx-auto bg-[#020a18] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
        
        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-2 bg-[#051124] border-b border-gray-800 p-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center items-center">
          <div className="col-span-1 pl-2 text-left">#</div> 
          <div className="col-span-2 text-left">Order ID</div>
          <div className="col-span-2 text-left">Customer</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Items</div>
          <div className="col-span-2">Total Bill (COD)</div>
          <div className="col-span-2 text-center">Actions</div> 
        </div>

        {/* TABLE BODY / ROWS */}
        <div className="divide-y divide-gray-800/60 p-2 flex flex-col gap-2">
          {orders.map((order, index) => {
            const isExpanded = expandedOrderId === order._id;
            const itemsCount = order.items?.length || 0;
            const totalBill = order.totalAmount || 0;
            const displayOrderId = order.orderId ? order.orderId.substring(0, 8) : (order._id ? order._id.substring(0, 8) : "N/A");
            
            const currentStatus = (order.status || "pending").toLowerCase();
            const isOrderPacked = !!packedOrders[order._id]; 

            return (
              <div 
                key={order._id || index} 
                className={`w-full rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded 
                    ? "border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)] bg-[#030e20] my-2" 
                    : "border border-transparent hover:border-gray-800"
                } ${isOrderPacked ? "bg-[#10b981]/5 opacity-80" : ""}`} 
              >
                
                {/* Main Visible Row */}
                <div 
                  onClick={() => toggleRow(order._id)}
                  className={`grid grid-cols-12 gap-2 p-4 items-center text-center transition-all cursor-pointer ${
                    isExpanded ? "bg-[#071d3d] border-b border-white/20" : "hover:bg-[#081b36]"
                  }`}
                >
                  
                  {/* Row Number + Checkbox */}
                  <div className="col-span-1 text-left pl-2 flex items-center gap-3">
                    <span className="font-bold text-gray-500 w-4">{index + 1}</span>
                    
                    <button
                      onClick={(e) => togglePackedOrder(order._id, e)}
                      className={`transition-all text-lg flex items-center justify-center p-1 rounded hover:bg-gray-800 ${
                        isOrderPacked ? "text-[#00ffa3]" : "text-gray-600 hover:text-white"
                      }`}
                      title={isOrderPacked ? "Mark as Unpacked" : "Mark as Packed"}
                    >
                      {isOrderPacked ? <FaCheckSquare /> : <FaSquare />}
                    </button>
                  </div>

                  {/* Order ID */}
                  <div className={`col-span-2 text-left font-mono font-bold ${isExpanded ? "text-white text-base" : "text-blue-400"} ${isOrderPacked ? "line-through text-gray-500" : ""}`}>
                    #{displayOrderId}
                  </div>
                  
                  {/* Customer Details */}
                  <div className="col-span-2 text-left">
                    <div className={`font-semibold truncate max-w-[150px] ${isOrderPacked ? "text-gray-400" : "text-gray-200"}`}>{order.firstName} {order.lastName}</div>
                    <div className="text-gray-500 text-xs truncate max-w-[150px]">{order.email}</div>
                  </div>
                  
                  {/* Date */}
                  <div className="col-span-2 text-gray-400">
                    {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                  </div>
                  
                  {/* Items Count */}
                  <div className="col-span-1 text-gray-300 font-semibold">
                    {itemsCount}
                  </div>
                  
                  {/* Total Bill */}
                  <div className="col-span-2 font-bold text-[#00ffa3]">
                    LKR {totalBill.toLocaleString()}
                  </div>
                  
                  {/* Actions Area */}
                  <div className="col-span-2 flex items-center justify-center gap-2 px-1" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`bg-[#0a1f44] text-[11px] font-bold p-2 rounded border outline-none cursor-pointer w-24 text-center transition-all ${
                        currentStatus === "delivered" ? "text-green-400 border-green-900" : currentStatus === "shipping" ? "text-blue-400 border-blue-900" : "text-amber-400 border-amber-900"
                      }`}
                    >
                      <option value="pending" className="text-amber-400 bg-[#041024]">Pending</option>
                      <option value="shipping" className="text-blue-400 bg-[#041024]">Shipping</option>
                      <option value="delivered" className="text-green-400 bg-[#041024]">Delivered</option>
                    </select>

                    {/* 💬 MESSAGE BUTTON (අලුතින් එකතු කළා) */}
                    <button
                      onClick={(e) => triggerMessageModal(order, e)}
                      className={`p-2 rounded bg-gray-800/20 hover:bg-blue-500/10 transition-all border flex items-center justify-center ${
                        order.adminMessage ? "text-amber-400 border-amber-500/40" : "text-gray-400 border-gray-800 hover:border-blue-500/30"
                      }`}
                      title={order.adminMessage ? "Edit / Delete Note" : "Add Store Note"}
                    >
                      <FaCommentDots size={14} />
                    </button>

                    <button 
                      onClick={() => triggerDeleteConfirm(order._id)}
                      className="text-gray-500 hover:text-red-500 p-2 rounded bg-gray-800/20 hover:bg-red-500/10 transition-all border border-gray-800 hover:border-red-500/30 flex items-center justify-center"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="p-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Shipping Profile */}
                      <div className="bg-[#071630] p-4 rounded-xl border border-gray-800">
                        <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2 text-xs uppercase tracking-wider">
                          <FaUser /> Shipping Information
                        </h3>
                        <p className="mb-1"><span className="text-gray-500">Name:</span> <strong className="text-white">{order.firstName} {order.lastName}</strong></p>
                        <p className="mb-1 flex items-center gap-2 mt-2">
                          <FaPhone className="text-xs text-gray-500"/> 
                          <span className="text-gray-300 font-mono font-bold">{order.phone}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{order.email}</p>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-[#071630] p-4 rounded-xl border border-gray-800">
                        <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2 text-xs uppercase tracking-wider">
                          <FaMapMarkerAlt /> Delivery Address
                        </h3>
                        <div className="text-gray-200 font-medium leading-relaxed text-xs md:text-sm">
                          <p>{order.addressLine1}</p>
                          {order.addressLine2 && <p>{order.addressLine2}</p>}
                          <p className="text-white font-bold mt-2 text-sm">City: {order.city}</p>
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="bg-[#071630] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
                        <div>
                          <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2 border-b border-gray-800 pb-2 text-xs uppercase tracking-wider">
                            Payment Summary
                          </h3>
                          <div className="mt-2 flex flex-col gap-2">
                            <span className="w-max text-[11px] font-bold bg-amber-600/20 text-amber-400 px-2 py-1 rounded border border-amber-600/30">
                              Cash On Delivery (COD)
                            </span>
                            {/* DB එකේ දැනට මැසේජ් එකක් තියේනම් ඒක Expanded view එකෙත් ලස්සනට පේන්න දැම්මා */}
                            {order.adminMessage && (
                              <div className="text-xs text-amber-300 bg-amber-500/5 p-2 rounded border border-amber-500/20 font-mono mt-1">
                                <span className="text-[10px] text-amber-500 font-bold block">STORE NOTE:</span>
                                {order.adminMessage}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-800/60 flex justify-between items-end">
                          <span className="text-gray-400 font-bold text-xs uppercase">Total Collectable:</span>
                          <span className="text-lg font-black text-[#00ffa3]">LKR {totalBill.toLocaleString()}</span>
                        </div>
                      </div>

                    </div>

                    {/* Ordered Items */}
                    <div className="mt-6 bg-[#051229] rounded-xl border border-gray-800 p-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Items To Pack ({itemsCount})
                      </h4>
                      <div className="flex flex-col gap-2">
                        {order.items && order.items.map((item, itemIdx) => {
                          const prod = item.product || {};
                          return (
                            <div key={itemIdx} className="flex items-center justify-between bg-[#091a38] p-3 rounded-lg border border-gray-800/40 hover:border-gray-700 transition-all">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={Array.isArray(prod.image) ? prod.image[0] : prod.image || "/placeholder.png"} 
                                  alt={prod.name} 
                                  className="w-12 h-12 object-cover rounded-md border border-gray-700 bg-[#041024]"
                                  onError={(e) => { e.target.src = "https://placehold.co/100x100?text=Product"; }}
                                />
                                <div>
                                  <p className="text-[10px] text-blue-400 font-mono font-semibold">{prod.productId}</p>
                                  <p className="text-white font-semibold text-xs md:text-sm">{prod.name}</p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-xs text-gray-400">Price: LKR {prod.price?.toLocaleString()}</p>
                                <p className="text-sm font-bold text-amber-400">Qty: {item.qty || 1}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* 💬 POP-UP MESSAGE MODAL (අලුතින් එකතු කළා) */}
      {showMsgModal && selectedOrderForMsg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-[#0b1b35] border border-blue-500/40 w-full max-w-lg rounded-2xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <h2 className="text-white text-lg font-bold mb-1 flex items-center gap-2">
              <FaCommentDots className="text-blue-400" /> Order Custom Note
            </h2>
            <p className="text-gray-400 text-xs mb-4">
              Order ID: <span className="font-mono text-blue-400 font-bold">#{selectedOrderForMsg.orderId}</span> ({selectedOrderForMsg.firstName} {selectedOrderForMsg.lastName})
            </p>

            {/* මැසේජ් එක ලියන Textarea එක */}
            <textarea
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Ex: Tracking: DOMEX1294. Dispatched via Domex Courier. Delivered within 2 days."
              className="w-full h-32 bg-[#041024] border border-gray-800 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition-all resize-none placeholder:text-gray-600"
            />

            <p className="text-[11px] text-gray-500 text-left mt-1">
              * Note: If you want to delete the message, just clear the text box and click save.
            </p>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => { setShowMsgModal(false); setSelectedOrderForMsg(null); }}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold transition-all border border-gray-700 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMessage}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 font-semibold transition-all text-xs"
              >
                Save & Sync Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 CUSTOM DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-[#0b1b35] border border-red-500/40 w-full max-w-md rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle size={28} />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Are you absolutely sure?</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              This action cannot be undone. This order will be permanently deleted from the database.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setShowDeleteModal(false); setOrderToDelete(null); }}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold transition-all border border-gray-700 text-xs"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmedDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 font-semibold transition-all text-xs"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}