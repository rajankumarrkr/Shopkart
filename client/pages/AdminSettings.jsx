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
                upiId: upiInput,
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

    const handleQrUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("qrCode", file);

        try {
            const { data } = await API.post("/admin/settings/qr", formData);
            setSettings(data);
            setMessage("QR Code updated successfully!");
        } catch (error) {
            setMessage("Failed to upload QR code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-black mb-12 flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-xl">⚙️</span>
                Payment Settings
            </h1>

            {message && (
                <div className={`p-4 rounded-xl mb-8 text-sm font-bold ${message.includes("success") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="glass-card p-10 space-y-8">
                    <h2 className="text-xl font-bold">General Settings</h2>
                    <form onSubmit={handleUpdateSettings} className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Admin UPI ID</label>
                            <input
                                type="text"
                                className="input-field"
                                value={upiInput}
                                onChange={(e) => setUpiInput(e.target.value)}
                                placeholder="example@upi"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Payment Instructions</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                value={instructionsInput}
                                onChange={(e) => setInstructionsInput(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="glass-card p-10 flex flex-col items-center text-center space-y-8">
                    <h2 className="text-xl font-bold w-full text-left">QR Code Management</h2>
                    <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden">
                        {settings.qrCodeUrl ? (
                            <img src={settings.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain p-4" />
                        ) : (
                            <span className="text-slate-300 text-sm">No QR Uploaded</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            id="qr-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleQrUpload}
                        />
                        <label htmlFor="qr-upload" className="btn-secondary py-3 px-8 cursor-pointer inline-block">
                            {loading ? "Uploading..." : "Upload New QR"}
                        </label>
                    </div>
                    <p className="text-xs text-slate-400">
                        This QR code will be displayed to users during checkout for instant scanning.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
