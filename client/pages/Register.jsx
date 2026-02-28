import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="max-w-md mx-auto py-20 px-4">
            <div className="glass-card p-10 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
                    <p className="text-white/40 mt-2">Join Shopkart community today</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field mt-1"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70 ml-1">Phone Number</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field mt-1"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Create Account
                    </button>
                </form>

                <p className="text-center text-white/40">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
