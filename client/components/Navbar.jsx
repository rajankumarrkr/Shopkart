import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [search, setSearch] = useState("");
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Top Navbar */}
            <nav className="fixed w-full z-50 top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4 h-16 sm:h-18">

                        {/* Logo */}
                        <Link to="/" className="text-xl font-black gradient-text tracking-tight shrink-0" aria-label="Shopkart home">
                            SHOPKART
                        </Link>

                        {/* Center search — hidden on mobile, shown on md+ */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search products, categories..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 focus:bg-white placeholder-slate-300 transition"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Right icons */}
                        <div className="flex items-center gap-1 sm:gap-2">

                            {/* Desktop nav links */}
                            <div className="hidden md:flex items-center gap-1">
                                <Link to="/" className="text-slate-600 hover:text-violet-600 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-violet-50 transition-all">Home</Link>
                                <Link to="/shop" className="text-slate-600 hover:text-violet-600 font-semibold text-sm px-3 py-2 rounded-xl hover:bg-violet-50 transition-all">Shop</Link>
                            </div>

                            {/* Wishlist icon (decorative) */}
                            <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-rose-500 transition-all" aria-label="Wishlist">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            {/* Cart — desktop only */}
                            <Link to="/cart" className="relative hidden md:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-all" aria-label="Cart">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-violet-600 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                                        {cartItems.length > 9 ? "9+" : cartItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile search bar */}
                            <form onSubmit={handleSearch} className="md:hidden flex">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="bg-slate-50 border border-slate-200 rounded-full pl-3 pr-8 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:bg-white placeholder-slate-300 transition"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>

                            {/* User menu — desktop */}
                            {user ? (
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => setShowUserMenu(v => !v)}
                                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-all"
                                        aria-label="User menu"
                                    >
                                        <div className="w-8 h-8 bg-violet-100 text-violet-700 rounded-lg flex items-center justify-center font-black text-sm">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <span className="hidden lg:block text-sm font-bold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                                        <svg className={`hidden lg:block w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showUserMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200 p-2 z-20 animate-fade-up">
                                                <div className="px-3 py-2 mb-1">
                                                    <p className="text-xs font-black text-slate-800">{user.name}</p>
                                                    <p className="text-[11px] text-slate-400">{user.role === "admin" ? "Administrator" : "Customer"}</p>
                                                </div>
                                                <div className="border-t border-slate-100 pt-1 space-y-0.5">
                                                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm text-slate-600 hover:text-violet-600 font-medium transition-colors">
                                                        <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-base">👤</span> My Profile
                                                    </Link>
                                                    <Link to="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm text-slate-600 hover:text-violet-600 font-medium transition-colors">
                                                        <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-base">📦</span> My Orders
                                                    </Link>
                                                    {user.role === "admin" && (
                                                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-violet-50 text-sm text-violet-700 font-bold transition-colors">
                                                            <span className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center text-base">🛡️</span> Admin Panel
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => { logout(); setShowUserMenu(false); }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-slate-500 hover:text-red-500 font-medium transition-colors mt-1 border-t border-slate-100 pt-2"
                                                    >
                                                        <span className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-base">🚪</span> Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="hidden md:inline-flex btn-primary py-2 px-5 text-sm font-black rounded-xl shadow-md shadow-violet-100">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation Bar — Mobile Only */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-around h-16 px-2">

                    {/* Home */}
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive("/") ? "text-violet-600" : "text-slate-400 hover:text-violet-500"}`}
                    >
                        <svg className="w-6 h-6" fill={isActive("/") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className={`text-[10px] font-bold ${isActive("/") ? "text-violet-600" : "text-slate-400"}`}>Home</span>
                        {isActive("/") && <span className="absolute bottom-1 w-1 h-1 bg-violet-600 rounded-full" />}
                    </Link>

                    {/* Category */}
                    <Link
                        to="/shop"
                        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive("/shop") ? "text-violet-600" : "text-slate-400 hover:text-violet-500"}`}
                    >
                        <svg className="w-6 h-6" fill={isActive("/shop") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span className={`text-[10px] font-bold ${isActive("/shop") ? "text-violet-600" : "text-slate-400"}`}>Category</span>
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className={`relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive("/cart") ? "text-violet-600" : "text-slate-400 hover:text-violet-500"}`}
                    >
                        {cartItems.length > 0 && (
                            <span className="absolute top-1 right-2 w-5 h-5 bg-violet-600 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none z-10">
                                {cartItems.length > 9 ? "9+" : cartItems.length}
                            </span>
                        )}
                        <svg className="w-6 h-6" fill={isActive("/cart") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className={`text-[10px] font-bold ${isActive("/cart") ? "text-violet-600" : "text-slate-400"}`}>Cart</span>
                    </Link>

                    {/* Account */}
                    <Link
                        to="/profile"
                        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all ${isActive("/profile") ? "text-violet-600" : "text-slate-400 hover:text-violet-500"}`}
                    >
                        {user ? (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${isActive("/profile") ? "bg-violet-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                        ) : (
                            <svg className="w-6 h-6" fill={isActive("/profile") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                        <span className={`text-[10px] font-bold ${isActive("/profile") ? "text-violet-600" : "text-slate-400"}`}>Account</span>
                    </Link>

                </div>
            </nav>
        </>
    );
};

export default Navbar;
