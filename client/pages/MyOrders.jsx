import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

const MyOrders = () => {
    const navigate = useNavigate();
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
            <div className="flex items-center justify-between w-full mt-4">
                {steps.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center relative flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors duration-500 text-xs font-bold ${idx <= currentIndex ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                            {idx < currentIndex ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (idx + 1)}
                        </div>
                        <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-wide ${idx <= currentIndex ? "text-violet-600" : "text-slate-400"}`}>{step}</span>
                        {idx < steps.length - 1 && (
                            <div className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 ${idx < currentIndex ? "bg-violet-600" : "bg-slate-200"}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-16 z-40 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate("/profile")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-base font-black text-slate-800">My Orders</h1>
                    <p className="text-xs text-slate-400">{orders.length} total orders</p>
                </div>
            </div>

            <div className="px-4 py-4 max-w-3xl mx-auto">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-36 bg-white rounded-2xl animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center text-4xl mb-4">📦</div>
                        <p className="text-slate-600 font-bold text-lg mb-1">No orders yet</p>
                        <p className="text-slate-400 text-sm mb-6">Apna pehla order do abhi!</p>
                        <Link to="/shop" className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                {/* Order Header */}
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap justify-between items-center gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                                        <p className="font-mono text-sm font-bold text-slate-700">#{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                                        <p className="text-sm font-semibold text-slate-600">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</p>
                                        <p className="text-sm font-black text-violet-600">₹{order.totalAmount}</p>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="px-4 py-3 space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 truncate">{item.product?.title}</p>
                                                <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Status Tracker */}
                                <div className="px-4 pb-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Status</p>
                                    <StatusTracker status={order.orderStatus} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
