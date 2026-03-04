import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
    const [shippingData, setShippingData] = useState({
        fullName: "", phone: "", address: "", city: "", state: "", pincode: ""
    });
    const [paymentData, setPaymentData] = useState({ transactionId: "", screenshot: null });
    const [adminSettings, setAdminSettings] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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

    const handleShippingSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.post("/orders", shippingData);
            setOrderId(data.order._id);
            setStep(2);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!paymentData.screenshot) return alert("Please upload payment screenshot");

        setLoading(true);
        const formData = new FormData();
        formData.append("paymentScreenshot", paymentData.screenshot);
        formData.append("transactionId", paymentData.transactionId);

        try {
            await API.post(`/orders/${orderId}/payment`, formData);
            setIsSuccess(true);
            setTimeout(() => {
                clearCart();
                navigate("/profile");
            }, 3000);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to upload payment proof");
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
                        <form onSubmit={handleShippingSubmit} className="glass-card p-10 space-y-8 animate-fade-right">
                            <h2 className="text-xl font-bold border-b border-slate-100 pb-4">Shipping Details</h2>
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
                            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                                {loading ? "Creating Order..." : "Next: Proceed to Payment"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handlePaymentSubmit} className="space-y-8 animate-fade-left">
                            <div className="glass-card p-10 bg-primary/[0.02] border-primary/10">
                                <h2 className="text-xl font-bold mb-6">Scan & Pay</h2>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center">
                                        {adminSettings?.qrCodeUrl ? (
                                            <img src={adminSettings.qrCodeUrl} alt="Payment QR" className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="text-slate-300 text-center text-xs">QR loading...</div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">UPI ID</p>
                                            <p className="text-lg font-black text-primary">{adminSettings?.upiId || "example@upi"}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100 italic">
                                            "{adminSettings?.paymentInstructions}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-10 space-y-8">
                                <h2 className="text-xl font-bold">Upload Verification</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Screenshot</label>
                                        <div className="relative h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer overflow-hidden group">
                                            <input
                                                type="file"
                                                required
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={e => setPaymentData({ ...paymentData, screenshot: e.target.files[0] })}
                                                accept="image/*"
                                            />
                                            {paymentData.screenshot ? (
                                                <div className="w-full h-full flex flex-col items-center justify-center">
                                                    <span className="text-emerald-500 font-bold text-sm mb-1 truncate px-4">{paymentData.screenshot.name}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase">Change Image</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📸</span>
                                                    <span className="text-xs font-bold text-slate-400 truncate px-4">Click or Drag Screenshot</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Transaction ID / Ref No.</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="Enter TXN ID"
                                            value={paymentData.transactionId}
                                            onChange={e => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                                        />
                                        <p className="mt-4 text-[10px] text-slate-400 leading-relaxed">
                                            Enter the 12-digit UPI reference number or Transaction ID from your payment app for faster verification.
                                        </p>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                                    {loading ? "Verifying..." : "Confirm & Submit Order"}
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors">
                                    &larr; Back to Shipping
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-card p-10 sticky top-24">
                        <h2 className="text-xl font-bold mb-8">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <span className="text-slate-500 truncate mr-4">{item.title} <span className="text-xs text-slate-400">×{item.qty}</span></span>
                                    <span className="font-bold">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
                            <span className="text-lg font-bold">Payable Amount</span>
                            <span className="text-3xl font-black text-primary">₹{cartTotal}</span>
                        </div>
                        <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
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
