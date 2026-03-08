import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SavedAddress = () => {
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        pincode: "",
        state: "",
        type: "Home",
    });

    const handleChange = (e) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.street || !form.city || !form.pincode || !form.state) {
            alert("Please fill all fields");
            return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 sticky top-16 z-40 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate("/profile")} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-base font-black text-slate-800">Saved Address</h1>
                    <p className="text-xs text-slate-400">Apna delivery address save karo</p>
                </div>
            </div>

            <div className="px-4 py-5 max-w-lg mx-auto">

                {/* Success Banner */}
                {saved && (
                    <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                        <span className="text-xl">✅</span>
                        <p className="text-sm font-bold text-emerald-700">Address save ho gaya!</p>
                    </div>
                )}

                {/* Address Type */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Address Type</p>
                    <div className="flex gap-2">
                        {["Home", "Work", "Other"].map(type => (
                            <button
                                key={type}
                                onClick={() => setForm(f => ({ ...f, type }))}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.type === type
                                    ? "border-violet-500 bg-violet-50 text-violet-700"
                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                    }`}
                            >
                                {type === "Home" ? "🏠" : type === "Work" ? "💼" : "📍"} {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Address Form */}
                <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Address Details</p>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Full Name *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Apna poora naam"
                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Mobile Number *</label>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Flat / House no., Street *</label>
                        <input
                            name="street"
                            value={form.street}
                            onChange={handleChange}
                            placeholder="Ghar number, gali, mohalla"
                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                        />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">City *</label>
                            <input
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                placeholder="City"
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                            />
                        </div>
                        <div className="w-28">
                            <label className="text-xs font-bold text-slate-500 mb-1 block">PIN Code *</label>
                            <input
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                placeholder="PIN"
                                maxLength={6}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">State *</label>
                        <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full text-sm border border-slate-200 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-slate-50 placeholder-slate-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-black py-3.5 rounded-xl transition-all mt-2"
                    >
                        📍 Save Address
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SavedAddress;
