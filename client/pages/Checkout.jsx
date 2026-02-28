import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { cartTotal, clearCart } = useCart();
    const [formData, setFormData] = useState({ address: "", city: "", zip: "" });
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Simulate API call
        setIsSuccess(true);
        setTimeout(() => {
            clearCart();
            navigate("/");
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-40 text-center">
                <div className="glass-card max-w-lg mx-auto p-12">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
                    <p className="text-white/60 mb-8">Thank you for shopping with us. Your order is being processed.</p>
                    <p className="text-sm text-white/30">Redirecting to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold mb-12">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Street Address"
                                className="input-field"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="input-field"
                                    required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    className="input-field"
                                    required
                                    value={formData.zip}
                                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                        <div className="p-4 border border-primary/30 rounded-xl bg-primary/5 flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary"></div>
                            <span className="font-semibold">Cash On Delivery</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Place Order
                    </button>
                </form>

                <div className="lg:col-span-1">
                    <div className="glass-card">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="border-t border-white/5 pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">${cartTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
