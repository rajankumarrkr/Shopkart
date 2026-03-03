import { useState, useEffect } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    const categories = ["All", "Tech", "Fashion", "Lifestyle", "Home"];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await API.get("/products");
                if (category === "All") {
                    setProducts(data);
                } else {
                    setProducts(data.filter((p) => p.category.toLowerCase() === category.toLowerCase()));
                }
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-extrabold mb-2">Our Collection</h1>
                    <p className="text-slate-400">Discover excellence in every detail.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${category === c ? "bg-primary text-white" : "bg-slate-50 border border-slate-100 hover:bg-slate-100"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="glass-card h-80 animate-pulse bg-slate-100"></div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-40 glass-card">
                    <p className="text-slate-400 text-lg">No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
