import { useState, useEffect } from "react";
import API from "../api/api";

const AdminSettings = () => {
    const [settings, setSettings] = useState({ upiId: "", paymentInstructions: "", qrCodeUrl: "" });
    const [upiInput, setUpiInput] = useState("");
    const [instructionsInput, setInstructionsInput] = useState("");
    const [qrFile, setQrFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await API.get("/admin/settings");
                setSettings(data);
                setUpiInput(data.upiId);
                setInstructionsInput(data.paymentInstructions);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await API.put("/admin/settings", {
                paymentInstructions: instructionsInput
            });
            setSettings(data);
            setMessage("Settings updated successfully!");
        } catch (error) {
            setMessage("Failed to update settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-12 flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-xl">⚙️</span>
                System Settings
            </h1>

            {message && (
                <div className={`p-4 rounded-xl mb-8 text-sm font-bold ${message.includes("success") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                    {message}
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                <div className="glass-card p-10 space-y-8">
                    <h2 className="text-xl font-bold">Checkout Settings</h2>
                    <form onSubmit={handleUpdateSettings} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Checkout Instructions</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                placeholder="Instructions for users during payment..."
                                value={instructionsInput}
                                onChange={(e) => setInstructionsInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4 text-blue-700">
                    <span className="text-2xl">⚡</span>
                    <p className="text-sm font-medium">
                        Razorpay Payment Gateway is active. Users will be automatically redirected to secure payment during checkout.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
