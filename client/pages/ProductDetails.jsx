import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    const handleBuyNow = () => {
        const item = { ...product, qty: 1 };
        navigate("/checkout", { state: { directItem: item } });
    };

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

    if (loading) return <div className="container mx-auto px-4 py-40 animate-pulse bg-slate-100 glass-card"></div>;
    if (!product) return <div className="container mx-auto px-4 py-40 text-center text-slate-400">Product not found.</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <Link to="/shop" className="text-slate-400 hover:text-primary mb-8 inline-flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
                {/* Images */}
                <div className="space-y-4">
                    <div className="glass-card aspect-square overflow-hidden rounded-3xl group relative">
                        <img src={mainImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`glass-card aspect-square overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${mainImage === img ? 'ring-2 ring-primary border-transparent' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4">{product.category}</span>
                    <h1 className="text-5xl font-black mb-6">{product.title}</h1>
                    <p className="text-slate-600 text-lg mb-10 leading-relaxed">{product.description}</p>

                    <div className="flex items-center gap-6 mb-12">
                        <span className="text-4xl font-black gradient-text">₹{product.discountPrice || product.price}</span>
                        {product.discountPrice && (
                            <span className="text-2xl text-slate-200 line-through">₹{product.price}</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                className="btn-secondary w-full py-5 text-xl flex items-center justify-center gap-3 border-2 border-primary/20"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Add to Bag
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/20"
                            >
                                Buy Now
                            </button>
                        </div>
                        <p className="text-center text-slate-300 text-sm">Free shipping on all premium items.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
