import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container mx-auto px-4 py-40 animate-pulse bg-white/5 glass-card"></div>;
    if (!product) return <div className="container mx-auto px-4 py-40 text-center text-white/40">Product not found.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/shop" className="text-white/40 hover:text-primary mb-8 inline-flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
                {/* Images */}
                <div className="space-y-4">
                    <div className="glass-card aspect-square overflow-hidden rounded-3xl">
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <div key={idx} className="glass-card aspect-square overflow-hidden rounded-xl cursor-not-allowed opacity-50">
                                <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4">{product.category}</span>
                    <h1 className="text-5xl font-black mb-6">{product.title}</h1>
                    <p className="text-white/60 text-lg mb-10 leading-relaxed">{product.description}</p>

                    <div className="flex items-center gap-6 mb-12">
                        <span className="text-4xl font-black gradient-text">${product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                            <span className="text-2xl text-white/20 line-through">${product.price}</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Add to Bags
                        </button>
                        <p className="text-center text-white/30 text-sm">Free shipping on all premium items.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
