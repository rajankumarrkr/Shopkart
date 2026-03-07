import { useState, useEffect } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const categories = ["All", "Tech", "Fashion", "Lifestyle", "Home"];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get("/products")
            .then(({ data }) => {
                setProducts(
                    category === "All"
                        ? data
                        : data.filter((p) => p.category.toLowerCase() === category.toLowerCase())
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category]);

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">

            {/* Header */}
            <div className="mb-8 sm:mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-1.5">Our Collection</h1>
                <p className="text-slate-400 text-sm sm:text-base">Discover excellence in every detail.</p>
            </div>

            {/* Category Filter — horizontal scroll on mobile */}
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
                    <div className="text-5xl mb-3">🛍️</div>
                    <p className="text-slate-400 font-semibold">No products in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
