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
            setOrderId(data.order._id);
            setStep(2); // Move to Payment step
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!paymentData.transactionId.trim()) {
            return alert("Please enter your UTR / Transaction ID");
        }

        setLoading(true);
        try {
            // Step 2: Submit Payment Details
            const formData = new FormData();
            if (paymentData.screenshot) {
                formData.append("paymentScreenshot", paymentData.screenshot);
            }
            formData.append("transactionId", paymentData.transactionId);

            await API.post(`/orders/${orderId}/payment`, formData);

            setIsSuccess(true);
            setTimeout(() => {
                clearCart();
                navigate("/profile");
            }, 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to submit payment. Please try again.");
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
                    <h1 className="text-3xl font-black mb-4">Payment Submitted!</h1>
                    <p className="text-slate-600 mb-8">Your order is now under verification. You can track its status in your profile.</p>
                    <p className="text-sm text-slate-400">Redirecting to My Orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
                <span className="p-3 bg-primary/10 rounded-2xl">💳</span>
                {step === 1 ? "Secure Checkout" : "Finalize Payment"}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">

                    {step === 1 ? (
                        /* SECTION 1: SHIPPING DETAILS */
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
                                {loading ? "Saving Address..." : "Next: Proceed to Payment"}
                            </button>
                        </form>
                    ) : (
                        /* SECTION 2: PAYMENT OPTIONS */
                        <form onSubmit={handlePaymentSubmit} className="space-y-8 animate-fade-up">
                            <div className="glass-card p-6 md:p-10 bg-primary/[0.02] border-primary/10">
                                <h2 className="text-lg md:text-xl font-bold mb-6">2. Scan & Pay</h2>

                                <div className="flex flex-col sm:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center shrink-0">
                                        {adminSettings?.qrCodeUrl ? (
                                            <img src={adminSettings.qrCodeUrl} alt="Payment QR" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-slate-300 text-center text-xs">QR loading...</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">UPI ID</p>
                                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                                                <p className="text-lg font-black text-primary truncate mr-4">{adminSettings?.upiId || "example@upi"}</p>
                                                <button
                                                    type="button"
                                                    onClick={copyUPI}
                                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${copied ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                                                >
                                                    {copied ? "Copied!" : "Copy"}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 p-4 rounded-xl text-sm text-amber-700 border border-amber-100 italic">
                                            "{adminSettings?.paymentInstructions || "Please scan the QR code and pay the exact amount."}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6 md:p-10 space-y-6 md:space-y-8">
                                <h2 className="text-lg md:text-xl font-bold">Upload Verification</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Transaction ID / UTR No. *</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="Enter 12-digit UTR"
                                            value={paymentData.transactionId}
                                            onChange={e => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                        />
                                        <p className="mt-2 text-[10px] text-slate-400">
                                            Enter the UPI reference number from your payment app for verification.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Screenshot (Optional)</label>
                                        <div className="relative h-24 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer overflow-hidden group">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={e => setPaymentData({ ...paymentData, screenshot: e.target.files[0] })}
                                                accept="image/*"
                                            />
                                            {paymentData.screenshot ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50">
                                                    <span className="text-emerald-600 font-bold text-sm mb-1 truncate px-4">✓ {paymentData.screenshot.name}</span>
                                                    <span className="text-[10px] text-emerald-500 uppercase">Change Image</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📸</span>
                                                    <span className="text-xs font-bold text-slate-400 truncate px-4">Upload Screenshot</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-8 shadow-xl shadow-primary/20 mb-4">
                                    {loading ? "Verifying..." : "Confirm & Submit Order"}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors text-center">
                                    &larr; Back to Shipping Address
                                </button>
                            </div>
                        </form>
                    )}
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
