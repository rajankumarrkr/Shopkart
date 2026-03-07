import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [search, setSearch] = useState("");
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate("/shop");
            setSearch("");
            setIsOpen(false);
        }
    };

    return (
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
                                <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        {/* Cart */}
                        <Link to="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 hover:text-violet-600 transition-all" aria-label="Cart">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItems.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 w-5 h-5 bg-violet-600 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                                    {cartItems.length > 9 ? "9+" : cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* User menu */}
                        {user ? (
                            <div className="relative">
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
                            <Link to="/login" className="hidden sm:inline-flex btn-primary py-2 px-5 text-sm font-black rounded-xl shadow-md shadow-violet-100">
                                Login
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsOpen(v => !v)}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-5 h-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {isOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile search bar */}
                <form onSubmit={handleSearch} className="md:hidden pb-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:bg-white placeholder-slate-300 transition"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    <div className="px-4 py-3 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:text-violet-600 text-sm transition-colors">
                            🏠 Home
                        </Link>
                        <Link to="/shop" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:text-violet-600 text-sm transition-colors">
                            🛍️ Shop
                        </Link>
                        <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 hover:text-violet-600 text-sm transition-colors">
                            <span className="flex items-center gap-3">🛒 Cart</span>
                            {cartItems.length > 0 && (
                                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">{cartItems.length}</span>
                            )}
                        </Link>
                        {user ? (
                            <>
                                <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 text-sm transition-colors">
                                    👤 My Account
                                </Link>
                                {user.role === "admin" && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-violet-700 font-bold hover:bg-violet-50 text-sm transition-colors">
                                        🛡️ Admin Panel
                                    </Link>
                                )}
                                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 text-sm transition-colors">
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center btn-primary py-3 rounded-xl font-black text-sm mt-2">
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
