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
            setOrders(data);
        } catch (error) {
            console.error(error);
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
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <p className="font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-slate-500 mt-1">{order.user?.name} | {order.user?.email}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="font-black text-primary">${order.totalAmount}</p>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border inline-block w-fit ${order.paymentStatus === "Approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    order.paymentStatus === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                                                        "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}>
                                                Pay: {order.paymentStatus}
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
                </div>
            )}

            {selectedOrder && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-card max-w-4xl w-full p-10 max-h-[90vh] overflow-y-auto relative animate-fade-up">
                        <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-2xl">✕</button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-2xl font-black mb-8 underline decoration-primary decoration-4 underline-offset-8">Payment Screenshot</h2>
                                <div className="aspect-[3/4] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
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

                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black mb-8 underline decoration-primary decoration-4 underline-offset-8">Order Summary</h2>

                                <div className="flex-1 space-y-6">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden">
                                                <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{item.product?.title}</p>
                                                <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                                    <div className="flex justify-between items-center text-2xl">
                                        <span className="font-bold">Total Amount</span>
                                        <span className="font-black text-primary">${selectedOrder.totalAmount}</span>
                                    </div>

                                    {selectedOrder.paymentStatus === "Verification Pending" && (
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <button
                                                onClick={() => handleAction(selectedOrder._id, "approve")}
                                                className="bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                            >
                                                ✅ Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(selectedOrder._id, "reject")}
                                                className="bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
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
