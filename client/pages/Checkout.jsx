import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const location = useLocation();

    // Support direct buy now via location state
    const directItem = location.state?.directItem;

    // Fallback: read directly from localStorage if context cartItems is empty (timing issue)
    const getCartItemsWithFallback = () => {
        if (cartItems && cartItems.length > 0) return cartItems;
        try {
            const saved = localStorage.getItem("cart");
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    };

    const resolvedCartItems = getCartItemsWithFallback();
    const finalItems = directItem ? [directItem] : resolvedCartItems;
    const resolvedTotal = resolvedCartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.qty, 0);
    const finalTotal = directItem ? (directItem.discountPrice || directItem.price) : resolvedTotal;

    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
    const [shippingData, setShippingData] = useState({
        fullName: "", phone: "", address: "", city: "", state: "", pincode: ""
    });
    const [paymentData, setPaymentData] = useState({ transactionId: "", screenshot: null });
    const [adminSettings, setAdminSettings] = useState(null);
    const [orderId, setOrderId] = useState(null); // Save order ID after Step 1
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await API.get("/admin/settings");
                setAdminSettings(data);
            } catch (error) {
                console.error("Error fetching admin settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const copyUPI = () => {
        navigator.clipboard.writeText(adminSettings?.upiId || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();

        if (finalItems.length === 0) {
            return alert("Your cart is empty. Please add items before checking out.");
        }

        setLoading(true);
        try {
            // Step 1: Create Order
            const orderPayload = {
                ...shippingData,
                items: finalItems,
                totalAmount: finalTotal
            };
            const { data } = await API.post("/orders", orderPayload);
            const orderId = data.order._id;
            setOrderId(orderId);

            // Step 2: Initialize Razorpay
            const { data: rzpData } = await API.post(`/orders/${orderId}/razorpay`);

            const options = {
                key: rzpData.key,
                amount: rzpData.rzpOrder.amount,
                currency: rzpData.rzpOrder.currency,
                name: "ShopKart",
                description: "Order Payment",
                order_id: rzpData.rzpOrder.id,
                handler: async (response) => {
                    try {
                        setLoading(true);
                        await API.post(`/orders/${orderId}/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setIsSuccess(true);
                        setTimeout(() => {
                            clearCart();
                            navigate("/profile");
                        }, 3000);
                    } catch (err) {
                        alert("Payment verification failed. Please contact support.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: shippingData.fullName,
                    contact: shippingData.phone,
                },
                theme: {
                    color: "#6366f1",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setStep(2); // Progress indicator
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-40 text-center">
                <div className="glass-card max-w-lg mx-auto p-12 animate-fade-up">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black mb-4">Payment Successful!</h1>
                    <p className="text-slate-600 mb-8">Your order has been confirmed. You can track its status in your profile.</p>
                    <p className="text-sm text-slate-400">Redirecting to My Orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
                <span className="p-3 bg-primary/10 rounded-2xl">💳</span>
                {step === 1 ? "Secure Checkout" : "Finalizing Order"}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">

                    {/* ALWAYS SHOW SHIPPING (until success) */}
                    <form onSubmit={handleShippingSubmit} className="glass-card p-6 md:p-10 space-y-6 md:space-y-8 animate-fade-right">
                        <h2 className="text-lg md:text-xl font-bold border-b border-slate-100 pb-4">1. Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                                <input type="text" required className="input-field" value={shippingData.fullName} onChange={e => setShippingData({ ...shippingData, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone Number</label>
                                <input type="text" required className="input-field" value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Street Address</label>
                            <input type="text" required className="input-field" value={shippingData.address} onChange={e => setShippingData({ ...shippingData, address: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
                                <input type="text" required className="input-field" value={shippingData.city} onChange={e => setShippingData({ ...shippingData, city: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">State</label>
                                <input type="text" required className="input-field" value={shippingData.state} onChange={e => setShippingData({ ...shippingData, state: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Pincode</label>
                                <input type="text" required className="input-field" value={shippingData.pincode} onChange={e => setShippingData({ ...shippingData, pincode: e.target.value })} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-8 shadow-xl shadow-primary/20">
                            {loading ? "Processing..." : (step === 1 ? "Next: Proceed to Payment" : "Retry Razorpay Payment")}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-card p-6 md:p-10 sticky top-24">
                        <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {finalItems.map((item) => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-slate-500 truncate mr-4">{item.title} <span className="text-xs text-slate-400">×{item.qty}</span></span>
                                    <span className="font-bold">₹{(item.discountPrice || item.price) * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                            <span className="text-lg font-bold">Payable Amount</span>
                            <span className="text-3xl font-black text-primary">₹{finalTotal}</span>
                        </div>

                        <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                            <span className="text-xl">🔒</span>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-tighter">Secure Transaction</p>
                                <p className="text-xs">SSL Encrypted Payment System</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
