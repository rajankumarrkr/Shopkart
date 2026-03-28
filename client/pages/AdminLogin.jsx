import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user } = await adminLogin(adminId, password);
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                setError("Access denied. Admins only.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Admin login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto py-20 px-4">
            <div className="glass-card p-10 space-y-8 border-t-4 border-t-primary">
                <div className="text-center">
                    <h2 className="text-3xl font-bold gradient-text">Admin Portal</h2>
                    <p className="text-slate-400 mt-2">Sign in to manage ShopKart</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-600 ml-1">Admin ID</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                placeholder="Enter your Admin ID"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field mt-1"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Admin Login
                    </button>
                </form>

                <p className="text-center text-slate-400">
                    Not an admin?{" "}
                    <Link to="/login" className="text-primary hover:underline">User Login</Link>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
