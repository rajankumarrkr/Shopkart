import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();

    return (
        <nav className="fixed w-full z-50 glass border-b border-slate-100 top-0 transition-all duration-300">
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
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                    >
                                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Customer</p>
                                        </div>
                                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* User Dropdown */}
                                    {showUserMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)}></div>
                                            <div className="absolute right-0 mt-3 w-56 glass-card p-2 shadow-2xl animate-fade-in z-20">
                                                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                                                </div>
                                                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 text-slate-600 hover:text-primary transition-colors group">
                                                    <span className="text-lg">👤</span>
                                                    <span className="text-sm font-bold">My Profile</span>
                                                </Link>
                                                <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 text-slate-600 hover:text-primary transition-colors group">
                                                    <span className="text-lg">📦</span>
                                                    <span className="text-sm font-bold">Order Status</span>
                                                </Link>
                                                {user.role === "admin" && (
                                                    <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 text-primary transition-colors">
                                                        <span className="text-lg">🛡️</span>
                                                        <span className="text-sm font-black">Admin Panel</span>
                                                    </Link>
                                                )}
                                                <div className="border-t border-slate-100 mt-2 pt-2">
                                                    <button
                                                        onClick={() => { logout(); setShowUserMenu(false); }}
                                                        className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="text-lg">🚪</span>
                                                        <span className="text-sm font-bold">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="btn-primary py-2 px-8 text-sm shadow-xl shadow-primary/20">Login</Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-800"
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
                        <>
                            <Link to="/profile" className="block px-3 py-2 text-slate-600">My Orders</Link>
                            <button onClick={logout} className="w-full text-left px-3 py-2 text-primary">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="block px-3 py-2 text-primary font-bold">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
