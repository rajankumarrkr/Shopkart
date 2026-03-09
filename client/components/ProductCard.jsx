import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import ShareModal from "./ShareModal";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isShareOpen, setIsShareOpen] = useState(false);

    const shareUrl = `${window.location.origin}/product/${product._id}`;

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: `Check out this ${product.title} on ShopKart!`,
                    url: shareUrl,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        } else {
            setIsShareOpen(true);
        }
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        navigate("/checkout", { state: { directItem: { ...product, qty: 1 } } });
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <>
            <Link to={`/product/${product._id}`} className="block h-full group">
                <div className="h-full flex flex-col bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm hover:shadow-md hover:border-violet-100 transition-all duration-300 overflow-hidden relative">

                    {/* Share Button (Top Right) */}
                    <button
                        onClick={handleShare}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-400 hover:text-violet-600 hover:scale-110 active:scale-95 transition-all duration-200 border border-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <img
                            src={product.images?.[0] || "https://via.placeholder.com/400?text=No+Image"}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Sale badge */}
                        {product.discountPrice && (
                            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                SALE
                            </span>
                        )}

                        {/* View overlay (desktop only) */}
                        <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/15 items-center justify-center transition-all duration-300">
                            <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                View Details
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2">{product.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1">{product.description}</p>

                        {/* Stars */}
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? "text-yellow-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-[10px] text-slate-400 ml-0.5">{product.rating.toFixed(1)}</span>
                            </div>
                        )}

                        {/* Price + Buttons */}
                        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                            <div className="flex flex-col min-w-0">
                                <span className="text-violet-600 font-black text-base sm:text-lg leading-none">
                                    ₹{product.discountPrice || product.price}
                                </span>
                                {product.discountPrice && (
                                    <span className="text-slate-300 text-[10px] line-through leading-none mt-0.5">
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-1.5 flex-shrink-0">
                                <button
                                    onClick={handleAddToCart}
                                    className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-[11px] font-bold transition-all duration-150"
                                >
                                    + Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-[11px] font-bold transition-all duration-150 shadow-sm shadow-violet-200"
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                product={product}
                shareUrl={shareUrl}
            />
        </>
    );
};

export default ProductCard;
