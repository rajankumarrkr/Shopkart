import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const { cartItems, removeFromCart, cartTotal } = useCart();

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
                                        <p className="text-primary font-bold mt-1">₹{item.price}</p>
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
                                    <span>Calculated at next step</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">₹{cartTotal}</span>
                                </div>
                            </div>
                            <Link to="/checkout" className="btn-primary w-full block text-center py-4">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
