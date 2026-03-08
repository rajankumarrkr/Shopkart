import { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
    { q: "Order cancel kaise karein?", a: "Abhi tak order status 'Pending' hai toh hum cancel kar sakte hain. Profile > My Orders me jao aur support se contact karo." },
    { q: "Return/Refund kaise hoga?", a: "Delivery ke 7 din ke andar return request karo. Email ya call se contact karo. Refund 5-7 business days me aa jayega." },
    { q: "Delivery kitne din mein hogi?", a: "Normal delivery 5-7 working days. Express delivery 2-3 working days me hoti hai." },
    { q: "Payment fail hua, paise kaate?", a: "Agar payment fail hoti hai aur paise kat gaye toh 3-5 business days mein auto-refund ho jaata hai." },
    { q: "Product damage aa gaya?", a: "Delivery ke 48 ghante ke andar photo leke support@shopkart.com pe mail karo. Replacement bhejenge." },
];

const HelpCenter = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

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
                    <h1 className="text-base font-black text-slate-800">Help Center</h1>
                    <p className="text-xs text-slate-400">Hum yahan hain aapki help ke liye</p>
                </div>
            </div>

            <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">

                {/* Contact Options */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-4 pt-4 pb-2">Contact Us</p>
                    {[
                        { icon: "📞", label: "Call Support", sub: "+91 9999 999 999", color: "bg-blue-50 text-blue-600", action: () => window.open("tel:+919999999999") },
                        { icon: "✉️", label: "Email Us", sub: "support@shopkart.com", color: "bg-emerald-50 text-emerald-600", action: () => window.open("mailto:support@shopkart.com") },
                        { icon: "💬", label: "Live Chat", sub: "Mon–Sat: 10am to 6pm", color: "bg-violet-50 text-violet-600", action: () => { } },
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={item.action}
                            className="w-full flex items-center gap-4 px-4 py-4 border-t border-slate-100 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
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
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider px-4 pt-4 pb-2">Frequently Asked Questions</p>
                    {faqs.map((faq, i) => (
                        <div key={i} className="border-t border-slate-100">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-slate-50 transition-colors gap-3"
                            >
                                <p className="text-sm font-semibold text-slate-700">{faq.q}</p>
                                <svg className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openFaq === i && (
                                <div className="px-4 pb-4">
                                    <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-3">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HelpCenter;
