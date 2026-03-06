import { useState, useEffect } from "react";
import API from "../api/api";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
            setSelectedOrder(null);
            alert(`Order ${action}ed successfully!`);
        } catch (error) {
            alert(`Failed to ${action} order.`);
        }
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
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
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
                                    <td className="p-6">
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
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-primary font-bold text-sm hover:underline"
                                        >
                                            View Details &rarr;
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-4xl mb-4">📭</p>
                            <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
                            <p className="text-slate-400 mt-2">When users start shopping, their orders will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-card max-w-4xl w-full p-10 max-h-[90vh] overflow-y-auto relative animate-fade-up">
                        <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-2xl">✕</button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                    <span className="text-primary text-2xl">💳</span>
                                    Payment Evidence
                                </h2>
                                <div className="aspect-[3/4] bg-slate-200/50 rounded-3xl overflow-hidden border border-slate-100 shadow-inner group relative">
                                    {selectedOrder.paymentScreenshot ? (
                                        <img src={selectedOrder.paymentScreenshot} alt="Proof" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">No screenshot uploaded</div>
                                    )}
                                </div>
                                <p className="mt-4 text-center font-mono text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-400">TXN ID:</span> {selectedOrder.transactionId || "N/A"}
                                </p>
                            </div>

                            <div className="space-y-8 flex-1 flex flex-col">
                                <section>
                                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                        <span className="text-primary text-2xl">📦</span>
                                        Order Summary
                                        <span className={`ml-auto text-[10px] font-black uppercase px-2 py-1 rounded border ${selectedOrder.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            selectedOrder.orderStatus === "Cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                                                "bg-blue-50 text-blue-600 border-blue-100"
                                            }`}>
                                            Status: {selectedOrder.orderStatus}
                                        </span>
                                    </h2>

                                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                                                    <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.product?.title}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">Qty: {item.quantity} × ₹{item.price}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary text-sm">₹{item.quantity * item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">📍 Shipping Details</h2>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Recipient</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Contact</p>
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.shippingAddress?.phone || "N/A"}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Address</p>
                                            <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <div className="mt-auto bg-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-slate-200 space-y-6">
                                    <div className="flex justify-between items-center text-2xl">
                                        <span className="font-bold text-white/60 text-lg uppercase tracking-tight">Total Amount</span>
                                        <span className="font-black text-white">₹{selectedOrder.totalAmount}</span>
                                    </div>

                                    {selectedOrder.paymentStatus === "Verification Pending" && (
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <button
                                                onClick={() => handleAction(selectedOrder._id, "approve")}
                                                className="bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedOrder._id, "reject")}
                                                className="bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                                            >
                                                ❌ Reject
                                            </button>
                                        </div>
                                    )}
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
