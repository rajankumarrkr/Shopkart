import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get("/orders/my-orders");
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Approved":
            case "Confirmed":
            case "Delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Rejected":
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const StatusTracker = ({ status }) => {
        const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];
        const currentIndex = steps.indexOf(status);

        return (
            <div className="flex items-center justify-between w-full max-w-md mt-6">
                {steps.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center relative flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${idx <= currentIndex ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
                            }`}>
                            {idx < currentIndex ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-xs font-bold">{idx + 1}</span>
                            )}
                        </div>
                        <span className={`text-[10px] mt-2 font-semibold uppercase tracking-wider ${idx <= currentIndex ? "text-primary" : "text-slate-400"
                            }`}>{step}</span>
                        {idx < steps.length - 1 && (
                            <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${idx < currentIndex ? "bg-primary" : "bg-slate-200"
                                }`}></div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-8 mb-16">
                <div className="flex-1 glass-card p-10 flex items-center gap-8">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl font-black">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
                        <p className="text-slate-500">{user?.email}</p>
                        <p className="text-slate-400 text-sm mt-2">{user?.phone || "No phone provided"}</p>
                    </div>
                </div>
                <div className="md:w-1/3 glass-card p-10 flex flex-col justify-center text-center">
                    <span className="text-4xl font-black text-primary mb-2">{orders.length}</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Orders</span>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order History & Status
            </h2>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 glass-card animate-pulse bg-slate-50"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="glass-card text-center py-20">
                    <p className="text-slate-400 text-lg mb-8">You haven't placed any orders yet.</p>
                    <a href="/shop" className="btn-primary px-8">Browse Collection</a>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="glass-card overflow-hidden border border-slate-100">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Order ID</p>
                                    <p className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Date</p>
                                    <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Amount</p>
                                    <p className="text-sm font-black text-primary">${order.totalAmount}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.paymentStatus)}`}>
                                        Payment: {order.paymentStatus}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.orderStatus)}`}>
                                        Order: {order.orderStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1 space-y-4 w-full">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                                <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold truncate">{item.product?.title}</p>
                                                <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full md:w-auto flex flex-col items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Delivery Timeline</p>
                                    <StatusTracker status={order.orderStatus} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Profile;
