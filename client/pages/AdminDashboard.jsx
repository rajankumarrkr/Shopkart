import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [ordersRes, productsRes] = await Promise.all([
                    API.get("/orders"),
                    API.get("/products")
                ]);

                const revenue = ordersRes.data
                    .filter(o => o.paymentStatus === "Approved")
                    .reduce((acc, curr) => acc + curr.totalAmount, 0);

                setStats({
                    orders: ordersRes.data.length,
                    products: productsRes.data.length,
                    revenue
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const navItems = [
        { label: "Manage Products", icon: "📦", path: "/admin/products", color: "bg-blue-500" },
        { label: "Review Orders", icon: "📑", path: "/admin/orders", color: "bg-emerald-500" },
        { label: "Payment Settings", icon: "⚙️", path: "/admin/settings", color: "bg-primary" }
    ];

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
                <span className="p-3 bg-primary/10 rounded-2xl">🛡️</span>
                Admin Command Center
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="glass-card p-10 border-b-4 border-blue-500">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Inventory</p>
                    <p className="text-5xl font-black">{loading ? "..." : stats.products}</p>
                    <p className="text-xs text-slate-400 mt-4">Active product listings</p>
                </div>
                <div className="glass-card p-10 border-b-4 border-emerald-500">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Orders</p>
                    <p className="text-5xl font-black">{loading ? "..." : stats.orders}</p>
                    <p className="text-xs text-slate-400 mt-4">Lifetime transactions</p>
                </div>
                <div className="glass-card p-10 border-b-4 border-primary">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                    <p className="text-5xl font-black text-primary">{loading ? "..." : `$${stats.revenue.toLocaleString()}`}</p>
                    <p className="text-xs text-slate-400 mt-4">Approved payments</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8">Management Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="glass-card p-8 group hover:scale-[1.02] transition-all flex flex-col items-center text-center"
                    >
                        <div className={`w-16 h-16 ${item.color} text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-xl group-hover:rotate-6 transition-transform`}>
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.label}</h3>
                        <p className="text-slate-400 text-sm">Control and update {item.label.split(" ")[1].toLowerCase()}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
