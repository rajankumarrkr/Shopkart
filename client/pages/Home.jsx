import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

/* ── Testimonials data ─────────────────────────── */
const TESTIMONIALS = [
  { id: 1, name: "Priya Sharma", role: "Fashion Blogger", avatar: "P", rating: 5, text: "Absolutely love the quality! Every product feels premium and the delivery was lightning fast. Shopkart has become my go-to for everything." },
  { id: 2, name: "Rahul Verma", role: "Tech Enthusiast", avatar: "R", rating: 5, text: "The tech collection is unreal. Got my gadgets at a steal and everything works perfectly. The packaging was super secure too!" },
  { id: 3, name: "Anjali Mehta", role: "Lifestyle Influencer", avatar: "A", rating: 5, text: "From browsing to checkout, the experience is seamless. The UI is beautiful and I found exactly what I was looking for within minutes." },
  { id: 4, name: "Vikram Singh", role: "Home Decor Enthusiast", avatar: "V", rating: 4, text: "Great product range and competitive pricing. The customer service team was super helpful when I had a question. Highly recommended!" },
];

const CATEGORIES = [
  { name: "Tech", emoji: "💻", desc: "Gadgets & Electronics", color: "from-blue-50 to-indigo-50", border: "border-blue-100", icon_bg: "bg-blue-100", icon_color: "text-blue-600", link: "/shop" },
  { name: "Fashion", emoji: "👗", desc: "Style & Apparel", color: "from-pink-50 to-rose-50", border: "border-pink-100", icon_bg: "bg-pink-100", icon_color: "text-pink-600", link: "/shop" },
  { name: "Lifestyle", emoji: "✨", desc: "Premium Living", color: "from-amber-50 to-orange-50", border: "border-amber-100", icon_bg: "bg-amber-100", icon_color: "text-amber-600", link: "/shop" },
  { name: "Home", emoji: "🏠", desc: "Decor & Essentials", color: "from-emerald-50 to-teal-50", border: "border-emerald-100", icon_bg: "bg-emerald-100", icon_color: "text-emerald-600", link: "/shop" },
];

/* ── Star component ────────────────────────────── */
const Stars = ({ n }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <svg key={s} className={`w-4 h-4 ${s <= n ? "text-yellow-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/* ── Main ──────────────────────────────────────── */
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(86400 - (Math.floor(Date.now() / 1000) % 86400));
  const timerRef = useRef(null);

  /* Countdown timer logic - synced with clock so it doesn't reset on refresh */
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft(86400 - (Math.floor(Date.now() / 1000) % 86400));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
      { n: h.toString().padStart(2, '0'), l: "HRS" },
      { n: m.toString().padStart(2, '0'), l: "MIN" },
      { n: s.toString().padStart(2, '0'), l: "SEC" }
    ];
  };

  useEffect(() => {
    API.get("/products")
      .then(({ data }) => setFeaturedProducts(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Auto rotate testimonials */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100 via-blue-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-pink-50 via-orange-50 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left text */}
            <div className="flex-1 text-center lg:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-bold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                New Arrivals Every Week
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.08] tracking-tight mb-6">
                Elevate Your<br />
                <span className="gradient-text">Lifestyle.</span>
              </h1>
              <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Discover a curated collection of premium products crafted for the modern individual. Quality meets style.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/shop"
                  className="btn-primary text-sm sm:text-base px-7 py-3.5 rounded-2xl font-black shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.03] transition-all">
                  Shop Now &rarr;
                </Link>
                <Link to="/shop"
                  className="text-sm sm:text-base px-7 py-3.5 rounded-2xl font-black border-2 border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600 transition-all">
                  Explore Categories
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-slate-100">
                {[["500+", "Products"], ["50K+", "Happy Buyers"], ["4.9★", "Avg Rating"]].map(([num, label]) => (
                  <div key={label} className="text-center lg:text-left">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{num}</p>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right image collage */}
            <div className="flex-1 relative w-full max-w-md lg:max-w-none">
              <div className="relative grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4] hover:scale-[1.02] transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="Watch" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square hover:scale-[1.02] transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80" alt="Lifestyle" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-3 pt-6">
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-square hover:scale-[1.02] transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" alt="Shoes" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4] hover:scale-[1.02] transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80" alt="Camera" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 z-10">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-lg">✅</div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Verified Quality</p>
                    <p className="text-[10px] text-slate-400">100% Authentic</p>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 z-10">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-lg">🚀</div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Fast Delivery</p>
                    <p className="text-[10px] text-slate-400">Free Shipping</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
                TRUST BAR
            ═══════════════════════════════════ */}
      <section className="bg-slate-50 border-y border-slate-100 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 sm:gap-0">
            {[
              ["🚚", "Free Shipping", "On all orders above ₹999"],
              ["🔒", "Secure Payment", "100% secure checkout"],
              ["↩️", "Easy Returns", "30-day return policy"],
              ["🏆", "Premium Quality", "Handpicked products"],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-black text-slate-800">{title}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
                CATEGORIES
            ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-violet-600 font-bold text-xs uppercase tracking-widest mb-2">Browse by Category</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Shop What You Love</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={cat.link}
              className={`group relative bg-gradient-to-br ${cat.color} border ${cat.border} rounded-3xl p-5 sm:p-7 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden`}
            >
              <div className={`${cat.icon_bg} rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {cat.emoji}
              </div>
              <h3 className="font-black text-slate-800 text-sm sm:text-base">{cat.name}</h3>
              <p className="text-slate-400 text-xs mt-1">{cat.desc}</p>
              <div className={`absolute bottom-3 right-3 ${cat.icon_color} opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold flex items-center gap-1`}>
                Explore <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
                FEATURED PRODUCTS
            ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="text-violet-600 font-bold text-xs uppercase tracking-widest mb-1">Handpicked for You</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Trending Now</h2>
            <p className="text-slate-400 text-sm mt-1">Our most loved products this week</p>
          </div>
          <Link to="/shop" className="text-violet-600 font-black text-sm flex items-center gap-1.5 hover:gap-3 transition-all group shrink-0">
            View All Products
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl h-64 sm:h-80 bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════
                PROMO BANNER
            ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 sm:p-12 text-white">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-black px-4 py-1.5 rounded-full mb-4 border border-white/20">
                🔥 Limited Time Offer
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
                Up to <span className="text-yellow-300">50% OFF</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base max-w-md">
                Don't miss out on our biggest sale of the season. Premium products at unbeatable prices.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="flex gap-3">
                {formatTime(timeLeft).map(({ n, l }) => (
                  <div key={l} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-center min-w-[56px]">
                    <p className="text-2xl font-black leading-none">{n}</p>
                    <p className="text-[10px] text-white/60 font-bold mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
              <Link to="/shop"
                className="bg-white text-violet-700 font-black text-sm px-8 py-3.5 rounded-2xl hover:bg-yellow-300 hover:text-violet-900 transition-all duration-300 shadow-xl hover:scale-[1.04] active:scale-95">
                Grab the Deal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
                BIG CATEGORY BANNERS
            ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", title: "Premium Tech", sub: "Latest gadgets for your workspace.", tag: "Tech" },
            { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", title: "Urban Style", sub: "Minimalist fashion redefined.", tag: "Fashion" },
          ].map(c => (
            <Link key={c.title} to="/shop"
              className="relative h-64 sm:h-80 rounded-3xl overflow-hidden group block">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
                <span className="text-[10px] font-black bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 mb-3 inline-block">{c.tag}</span>
                <h3 className="text-2xl sm:text-3xl font-black mb-1.5">{c.title}</h3>
                <p className="text-white/70 text-sm mb-4">{c.sub}</p>
                <span className="inline-flex items-center gap-2 bg-white text-slate-900 font-black text-xs px-4 py-2 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
                TESTIMONIALS
            ═══════════════════════════════════ */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-violet-600 font-bold text-xs uppercase tracking-widest mb-2">What Customers Say</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Loved by Thousands</h2>
          </div>

          {/* Desktop 4-col */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.id} className={`bg-white rounded-3xl p-6 border transition-all duration-300 ${i === activeTestimonial ? "border-violet-200 shadow-xl shadow-violet-100 scale-[1.02]" : "border-slate-100 shadow-sm"}`}>
                <Stars n={t.rating} />
                <p className="text-slate-600 text-sm leading-relaxed my-4 line-clamp-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-[11px]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div className="md:hidden">
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <Stars n={TESTIMONIALS[activeTestimonial].rating} />
              <p className="text-slate-600 text-sm leading-relaxed my-4">"{TESTIMONIALS[activeTestimonial].text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white font-black text-sm flex items-center justify-center">
                  {TESTIMONIALS[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{TESTIMONIALS[activeTestimonial].name}</p>
                  <p className="text-slate-400 text-[11px]">{TESTIMONIALS[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-5 h-2 bg-violet-600" : "w-2 h-2 bg-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
                NEWSLETTER
            ═══════════════════════════════════ */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border border-violet-100 rounded-3xl p-8 sm:p-12 text-center">
          <span className="text-4xl mb-4 block">💌</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Stay in the Loop</h2>
          <p className="text-slate-500 text-sm sm:text-base mb-7 max-w-md mx-auto">
            Subscribe for exclusive deals, new arrivals, and style inspiration — straight to your inbox.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-sm px-6 py-3 rounded-2xl">
              <span>✅</span> You're subscribed! Thanks for joining.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition"
              />
              <button type="submit"
                className="btn-primary px-7 py-3.5 rounded-2xl font-black text-sm whitespace-nowrap shadow-lg shadow-violet-200 hover:scale-[1.03] transition-all">
                Subscribe →
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;