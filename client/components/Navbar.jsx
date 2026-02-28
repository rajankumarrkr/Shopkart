import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    return (
        <nav className="fixed w-full z-50 glass border-b border-white/5 top-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-extrabold gradient-text tracking-tighter">
                            SHOPKART
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/shop" className="nav-link">Shop</Link>
                            <Link to="/cart" className="nav-link relative">
                                Cart
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1 -right-4 bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-white/70 text-sm">Hi, {user.name}</span>
                                    <button onClick={logout} className="btn-secondary py-1.5 px-4 text-sm">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary py-1.5 px-6 text-sm">Login</Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white/70 hover:text-white"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={isOpen ? "hidden" : "inline-flex"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={isOpen ? "inline-flex" : "hidden"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? "block" : "hidden"} md:hidden glass-card rounded-none border-x-0`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" className="block px-3 py-2 text-white/70">Home</Link>
                    <Link to="/shop" className="block px-3 py-2 text-white/70">Shop</Link>
                    <Link to="/cart" className="block px-3 py-2 text-white/70">Cart ({cartItems.length})</Link>
                    {user ? (
                        <button onClick={logout} className="w-full text-left px-3 py-2 text-primary">Logout</button>
                    ) : (
                        <Link to="/login" className="block px-3 py-2 text-primary font-bold">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
