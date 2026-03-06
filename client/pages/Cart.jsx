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
                setOrderId(response.data.order._id);
                setStep(2);
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

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!paymentData.utrNumber.trim()) return alert("Please enter your UTR / Transaction ID");

        setLoading(true);
        const formData = new FormData();
        if (paymentData.screenshot) {
            formData.append("paymentScreenshot", paymentData.screenshot);
        }
        formData.append("transactionId", paymentData.utrNumber);

        try {
            await API.post(`/orders/${orderId}/payment`, formData);
            setIsSuccess(true);
            setTimeout(() => {
                clearCart();
                setShowPayment(false);
            }, 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyUPI = () => {
        navigator.clipboard.writeText(adminSettings?.upiId || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                Proceed to Payment
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
                                <h2 className="text-2xl font-black text-slate-800 mb-3">Payment Submitted!</h2>
                                <p className="text-slate-500 text-sm">Your order is under verification. Thank you! 🎉</p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                    <h2 className="text-xl font-black text-slate-800">
                                        {step === 1 ? "📦 Shipping Details" : "💳 Pay via UPI"}
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

                                {/* Step 1 — Shipping */}
                                {step === 1 && (
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
                                                {loading ? "Creating Order..." : "Next: Proceed to Payment →"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Step 2 — UPI Payment */}
                                {step === 2 && (
                                    <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
                                        {/* Amount */}
                                        <div className="text-center p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Amount to Pay</p>
                                            <p className="text-3xl font-black text-primary">₹{cartTotal}</p>
                                        </div>

                                        {/* QR Code */}
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-xl border-2 border-slate-100 flex items-center justify-center">
                                                {adminSettings?.qrCodeUrl ? (
                                                    <img src={adminSettings.qrCodeUrl} alt="UPI QR Code" className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="w-24 h-24 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-2">
                                                            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-slate-400">QR Code Loading...</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">📱 Scan with any UPI app</p>
                                        </div>

                                        {/* UPI ID */}
                                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">UPI ID</p>
                                                <p className="text-lg font-black text-primary">{adminSettings?.upiId || "Loading..."}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={copyUPI}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${copied ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                                            >
                                                {copied ? "✓ Copied!" : "Copy"}
                                            </button>
                                        </div>

                                        {/* Instructions */}
                                        {adminSettings?.paymentInstructions && (
                                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 italic">
                                                {adminSettings.paymentInstructions}
                                            </div>
                                        )}

                                        {/* UTR Number */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                                                UTR / Transaction Number *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="input-field"
                                                placeholder="Enter 12-digit UTR or TXN ID"
                                                value={paymentData.utrNumber}
                                                onChange={e => setPaymentData({ ...paymentData, utrNumber: e.target.value })}
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Find this in your payment app's transaction history</p>
                                        </div>

                                        {/* Screenshot (optional) */}
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                                                Payment Screenshot (Optional)
                                            </label>
                                            <div className="relative h-28 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer overflow-hidden">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={e => setPaymentData({ ...paymentData, screenshot: e.target.files[0] })}
                                                    accept="image/*"
                                                />
                                                {paymentData.screenshot ? (
                                                    <span className="text-emerald-600 font-bold text-sm">✓ {paymentData.screenshot.name}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-2xl mb-1">📸</span>
                                                        <span className="text-xs text-slate-400 font-semibold">Click to upload screenshot</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                                                {loading ? "Submitting..." : "✅ Confirm Payment"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors py-2"
                                            >
                                                ← Back to Shipping
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
