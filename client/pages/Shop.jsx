import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Tech", "Fashion", "Lifestyle", "Home"];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

    const query = searchParams.get("q") || "";

    // Fetch all products once
    useEffect(() => {
        setLoading(true);
        API.get("/products")
            .then(({ data }) => {
                setAllProducts(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Filter whenever category or query changes
    useEffect(() => {
        let filtered = allProducts;

        // Category filter
        if (category !== "All") {
            filtered = filtered.filter(
                (p) => p.category?.toLowerCase() === category.toLowerCase()
            );
        }

        // Search query filter
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
            );
        }

        setProducts(filtered);
    }, [allProducts, category, query]);

    // Sync search input when URL query changes (triggered from Navbar)
    useEffect(() => {
        setSearchInput(searchParams.get("q") || "");
    }, [searchParams]);

    const handleLocalSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput.trim() });
        } else {
            setSearchParams({});
        }
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearchParams({});
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 pb-24">

            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1.5">
                    {query ? `Results for "${query}"` : "Our Collection"}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                    {query
                        ? `${products.length} product${products.length !== 1 ? "s" : ""} found`
                        : "Discover excellence in every detail."}
                </p>
            </div>

            {/* Search Bar (visible on all screens) */}
            <form onSubmit={handleLocalSearch} className="mb-6">
                <div className="relative max-w-xl">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="Search products, categories..."
                        className="w-full bg-white border border-slate-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 placeholder-slate-300 shadow-sm transition"
                    />
                    {searchInput ? (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : null}
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap active:scale-95
                            ${category === c
                                ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                                : "bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="rounded-2xl h-64 sm:h-80 animate-pulse bg-slate-100" />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white/70 rounded-2xl border border-slate-100">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-slate-700 font-bold text-lg mb-1">
                        {query ? `"${query}" nahi mila` : "Koi product nahi mila"}
                    </p>
                    <p className="text-slate-400 text-sm mb-6">Koi aur keyword try karo</p>
                    {query && (
                        <button
                            onClick={clearSearch}
                            className="bg-violet-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shop;
