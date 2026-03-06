import { useState, useEffect } from "react";
import API from "../api/api";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get("/orders");
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await API.put(`/orders/${id}/${action}`);
            fetchOrders();
            setShowModal(false);
            setSelectedOrder(null);
            alert(`Order ${action}ed successfully!`);
        } catch (error) {
            alert(`Failed to ${action} order.`);
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-black mb-12 flex items-center gap-3">
                <span className="p-2 bg-emerald-500/10 rounded-xl">📑</span>
                Order Review
            </h1>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 glass-card animate-pulse bg-slate-50 font"></div>)}
                </div>
            ) : (
                <div className="glass-card overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Order / User</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Array.isArray(orders) && orders.map((order) => (
                                    <tr key={order?._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 md:p-6">
                                            <p className="font-bold text-sm">#{order?._id?.slice(-8).toUpperCase() || "UNKNOWN"}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {order.user?.name || "Unregistered User"} | {order.user?.email || "No Email"}
                                            </p>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-primary">₹{order.totalAmount}</p>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border inline-block w-fit ${order.paymentStatus === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    order.paymentStatus === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-amber-50 text-amber-600 border-amber-100"
                                                    }`}>
                                                    Pay: {order.paymentStatus || "Pending"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => openOrderDetails(order)}
                                                className="text-primary font-bold text-sm hover:underline"
                                            >
                                                View Details &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {orders.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-4xl mb-4">📭</p>
                            <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
                            <p className="text-slate-400 mt-2">When users start shopping, their orders will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {showModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
                    <div className="glass-card max-w-4xl w-[95vw] md:w-full p-0 max-h-[95vh] overflow-hidden flex flex-col shadow-3xl animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-none">Order Details</h2>
                                <p className="text-slate-400 text-xs md:text-sm font-medium mt-2">ID: #{selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                {/* Left: Proof & Status */}
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                                            <span className="text-primary text-xl">💳</span>
                                            Payment Evidence
                                        </h2>
                                        <div className="aspect-[4/5] md:aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-inner group relative">
                                            {selectedOrder.paymentScreenshot ? (
                                                <img src={selectedOrder.paymentScreenshot} alt="Proof" className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No screenshot uploaded</div>
                                            )}
                                        </div>
                                        <p className="mt-4 text-center font-mono text-xs md:text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 truncate">
                                            <span className="text-slate-400">TXN ID:</span> {selectedOrder.transactionId || "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h2 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4">📍 Shipping Details</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] uppercase font-bold text-slate-400">Recipient</p>
                                                    <p className="text-xs md:text-sm font-bold text-slate-800">{selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase font-bold text-slate-400">Contact</p>
                                                    <p className="text-xs md:text-sm font-bold text-slate-800">{selectedOrder.shippingAddress?.phone || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-slate-400">Address</p>
                                                <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed">
                                                    {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Items & Summary */}
                                <div className="space-y-8 flex flex-col h-full">
                                    <section>
                                        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
                                            <span className="text-primary text-xl">📦</span>
                                            Order Summary
                                            <span className={`ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded border ${selectedOrder.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                selectedOrder.orderStatus === "Cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                                }`}>
                                                {selectedOrder.orderStatus}
                                            </span>
                                        </h2>

                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                                        <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-xs text-slate-800 truncate">{item.product?.title}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">{item.quantity} × ₹{item.price}</p>
                                                    </div>
                                                    <p className="font-bold text-primary text-xs shrink-0">₹{item.quantity * item.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="mt-auto bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-slate-200">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-bold text-white/50 text-xs md:text-sm uppercase tracking-widest">Total Amount</span>
                                            <span className="font-black text-xl md:text-2xl text-white">₹{selectedOrder.totalAmount}</span>
                                        </div>

                                        {selectedOrder.paymentStatus === "Verification Pending" && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => handleAction(selectedOrder._id, "approve")}
                                                    className="bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-600 transition-all active:scale-95 text-xs md:text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedOrder._id, "reject")}
                                                    className="bg-red-500 text-white font-black py-3 rounded-xl hover:bg-red-600 transition-all active:scale-95 text-xs md:text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
