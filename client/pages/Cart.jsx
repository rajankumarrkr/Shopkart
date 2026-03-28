import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";

const Cart = () => {
    const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPayment, setShowPayment] = useState(false);
    const [adminSettings, setAdminSettings] = useState(null);
    const [shippingData, setShippingData] = useState({
        fullName: "", phone: "", address: "", city: "", state: "", pincode: ""
    });
    const [step, setStep] = useState(1); // 1: Shipping, 2: UPI Payment
    const [paymentData, setPaymentData] = useState({ utrNumber: "", screenshot: null });
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (showPayment) {
            const fetchSettings = async () => {
                try {
                    const { data } = await API.get("/admin/settings");
                    setAdminSettings(data);
                } catch (error) {
                    console.error("Error fetching admin settings:", error);
                }
            };
            fetchSettings();
        }
    }, [showPayment]);

    const handleProceed = () => {
        if (cartItems.length === 0) return;
        if (!user) {
            alert("Payment ke liye pehle login karein!");
            navigate("/login");
            return;
        }
        setShowPayment(true);
        setStep(1);
        setIsSuccess(false);
    };

    const handleShippingSubmit = async (e) => {
        e.preventDefault();

        // Simple client-side validation
        if (!shippingData.fullName.trim()) return alert("Please enter your full name");
        if (!shippingData.phone.trim()) return alert("Please enter your phone number");
        if (!shippingData.address.trim()) return alert("Please enter your street address");
        if (!shippingData.city.trim()) return alert("Please enter your city");
        if (!shippingData.state.trim()) return alert("Please enter your state");
        if (!shippingData.pincode.trim()) return alert("Please enter your pincode");

        setLoading(true);
        try {
            const orderPayload = {
                ...shippingData,
                items: cartItems,
                totalAmount: cartTotal
            };
            const response = await API.post("/orders", orderPayload);

            if (response.data && response.data.order) {
                const orderId = response.data.order._id;
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
                                setShowPayment(false);
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
                setStep(2); // Just to indicate progress
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Failed to create order. Please try again.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold mb-12">Shopping Bag</h1>

            {cartItems.length === 0 ? (
                <div className="glass-card text-center py-20">
                    <p className="text-slate-400 text-xl mb-8">Your bag is empty.</p>
                    <Link to="/shop" className="btn-primary px-8">Start Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="glass-card flex items-center justify-between gap-6 p-4">
                                <div className="flex items-center gap-6">
                                    <img src={item.images[0]} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
                                    <div>
                                        <h3 className="text-lg font-bold">{item.title}</h3>
                                        <p className="text-slate-400 text-sm">Qty: {item.qty}</p>
                                        <p className="text-primary font-bold mt-1">₹{(item.discountPrice || item.price) * item.qty}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-semibold">Free</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">₹{cartTotal}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleProceed}
                                className="btn-primary w-full block text-center py-4"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PAYMENT MODAL ===== */}
            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up">

                        {/* Success State */}
                        {isSuccess ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 mb-3">Order Placed!</h2>
                                <p className="text-slate-500 text-sm">Your payment was successful and your order is confirmed. 🎉</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                    <h2 className="text-xl font-black text-slate-800">
                                        {step === 1 ? "📦 Shipping Details" : "💳 Completing Payment"}
                                    </h2>
                                    <button
                                        onClick={() => setShowPayment(false)}
                                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Step 1 — Shipping (Always visible until payment starts) */}
                                <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                                            <input type="text" required className="input-field" value={shippingData.fullName} onChange={e => setShippingData({ ...shippingData, fullName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                                            <input type="text" required className="input-field" value={shippingData.phone} onChange={e => setShippingData({ ...shippingData, phone: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Address</label>
                                        <input type="text" required className="input-field" value={shippingData.address} onChange={e => setShippingData({ ...shippingData, address: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
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
                                    <div className="pt-2">
                                        <div className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <span className="text-sm font-bold text-slate-600">Total Payable</span>
                                            <span className="text-xl font-black text-primary">₹{cartTotal}</span>
                                        </div>
                                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                                            {loading ? "Processing..." : "Pay with Razorpay →"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
