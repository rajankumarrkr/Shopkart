import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Profile = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuSections = [
        {
            title: "My Account",
            items: [
                {
                    icon: "📦",
                    label: "My Orders",
                    sub: "Track & view all your orders",
                    to: "/account/orders",
                    color: "bg-blue-50 text-blue-600",
                },
                {
                    icon: "📍",
                    label: "Saved Address",
                    sub: "Manage delivery addresses",
                    to: "/account/address",
                    color: "bg-amber-50 text-amber-600",
                },
                {
                    icon: "🛒",
                    label: "My Cart",
                    sub: `${cartItems.length} items in your cart`,
                    to: "/cart",
                    color: "bg-violet-50 text-violet-600",
                },
            ],
        },
        {
            title: "Support",
            items: [
                {
                    icon: "💬",
                    label: "Help Center",
                    sub: "FAQs, call & email support",
                    to: "/account/help",
                    color: "bg-emerald-50 text-emerald-600",
                },
                {
                    icon: "⭐",
                    label: "Rate the App",
                    sub: "Tell us how we're doing",
                    to: "#",
                    color: "bg-rose-50 text-rose-500",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">

            {/* Profile Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-slate-800 truncate">{user?.name}</h1>
                        <p className="text-slate-400 text-sm truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-600">
                            {user?.role === "admin" ? "Administrator" : "Customer"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 max-w-lg mx-auto space-y-4">

                {/* Admin Panel — only for admin */}
                {user?.role === "admin" && (
                    <Link
                        to="/admin"
                        className="flex items-center gap-4 bg-violet-600 text-white rounded-2xl px-4 py-4 shadow-md shadow-violet-200"
                    >
                        <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">🛡️</div>
                        <div className="flex-1">
                            <p className="font-black text-sm">Admin Panel</p>
                            <p className="text-violet-200 text-xs">Manage orders, products & more</p>
                        </div>
                        <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}

                {/* Menu Sections */}
                {menuSections.map(section => (
                    <div key={section.title} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">{section.title}</p>
                        {section.items.map((item, i) => (
                            <Link
                                key={i}
                                to={item.to}
                                className="flex items-center gap-4 px-4 py-4 border-t border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                            >
                                <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl flex-shrink-0`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                    <p className="text-xs text-slate-400 truncate">{item.sub}</p>
                                </div>
                                <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                ))}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 bg-white border border-slate-100 rounded-2xl px-4 py-4 shadow-sm hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                    <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">🚪</div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-red-500">Logout</p>
                        <p className="text-xs text-slate-400">Sign out from your account</p>
                    </div>
                </button>

                {/* App Version */}
                <p className="text-center text-xs text-slate-300 font-medium pt-2">Shopkart v1.0.0</p>
            </div>
        </div>
    );
};

export default Profile;
