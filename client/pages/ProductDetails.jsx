import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ShareModal from "../components/ShareModal";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet-async";

/* ─── Star Rating ─────────────────────────────────────── */
const StarRating = ({ value, onChange, size = "md" }) => {
    const [hovered, setHovered] = useState(0);
    const sz = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange && onChange(star)}
                    onMouseEnter={() => onChange && setHovered(star)}
                    onMouseLeave={() => onChange && setHovered(0)}
                    className={`transition-transform ${onChange ? "cursor-pointer active:scale-90 hover:scale-110" : "cursor-default"}`}
                >
                    <svg
                        className={`${sz} ${star <= (hovered || value) ? "text-yellow-400" : "text-slate-200"} transition-colors duration-150`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

/* ─── Image Slider ────────────────────────────────────── */
const ImageSlider = ({ images }) => {
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(null);
    const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 40) next();
        else if (diff < -40) prev();
        touchStartX.current = null;
    };
    if (!images || images.length === 0) return null;

    return (
        <div className="w-full space-y-3">
            {/* Main image */}
            <div
                className="relative w-full rounded-2xl overflow-hidden bg-slate-50"
                style={{ aspectRatio: "1 / 1" }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    key={current}
                    src={images[current]}
                    alt={`Product ${current + 1}`}
                    className="w-full h-full object-cover"
                    style={{ animation: "fadeIn 0.35s ease" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous image"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 backdrop-blur-sm shadow-md flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next image"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 backdrop-blur-sm shadow-md flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {current + 1}/{images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="flex justify-center gap-1.5">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`rounded-full transition-all duration-300 ${idx === current ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-slate-300"}`}
                        />
                    ))}
                </div>
            )}

            {/* Thumbnail row */}
            {images.length > 1 && (
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)` }}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`aspect-square rounded-xl overflow-hidden transition-all duration-200 ${idx === current ? "ring-2 ring-primary shadow-sm" : "opacity-50 hover:opacity-80 active:opacity-90"}`}
                        >
                            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Review Card ─────────────────────────────────────── */
const ReviewCard = ({ review }) => {
    const [videoModal, setVideoModal] = useState(null);
    const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });
    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{review.user?.name || "User"}</p>
                        <p className="text-slate-400 text-[11px]">{date}</p>
                    </div>
                </div>
                <StarRating value={review.rating} size="sm" />
            </div>

            {review.comment && (
                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
            )}

            {review.mediaUrls?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {review.mediaUrls.map((url, idx) => (
                        <div
                            key={idx}
                            onClick={() => review.mediaTypes?.[idx] === "video" && setVideoModal(url)}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0"
                        >
                            {review.mediaTypes?.[idx] === "video" ? (
                                <>
                                    <video src={url} className="w-full h-full object-cover" muted />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <img src={url} alt="review media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Video modal */}
            {videoModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setVideoModal(null)}
                >
                    <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <video src={videoModal} controls autoPlay className="w-full rounded-2xl" />
                        <button
                            onClick={() => setVideoModal(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Review Form ─────────────────────────────────────── */
const ReviewForm = ({ productId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [mediaFiles, setMediaFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef();

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles((p) => [...p, ...files]);
        setPreviews((p) => [
            ...p,
            ...files.map((f) => ({ url: URL.createObjectURL(f), type: f.type.startsWith("video/") ? "video" : "image" })),
        ]);
    };

    const removeMedia = (idx) => {
        setMediaFiles((p) => p.filter((_, i) => i !== idx));
        setPreviews((p) => p.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating) { setError("Please choose a rating."); return; }
        setError("");
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("rating", rating);
            formData.append("comment", comment);
            mediaFiles.forEach((f) => formData.append("media", f));
            const { data } = await API.post(`/reviews/${productId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            onSuccess(data);
            setRating(0); setComment(""); setMediaFiles([]); setPreviews([]);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="font-black text-slate-800 text-base sm:text-lg">Write a Review</h3>

            <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Rating *</p>
                <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Comment</p>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Share your experience..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 resize-none transition"
                />
            </div>

            {/* Upload */}
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Photos / Videos</p>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 hover:border-violet-300 active:border-violet-400 rounded-xl py-4 flex flex-col items-center gap-1 transition-colors"
                >
                    <div className="w-9 h-9 rounded-full bg-violet-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Tap to add photos or videos</span>
                    <span className="text-[10px] text-slate-300">Max 5 files · images & videos</span>
                </button>
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFiles} className="hidden" />

                {previews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                        {previews.map((p, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                {p.type === "video"
                                    ? <video src={p.url} className="w-full h-full object-cover" muted />
                                    : <img src={p.url} alt="preview" className="w-full h-full object-cover" />
                                }
                                <button
                                    type="button"
                                    onClick={() => removeMedia(idx)}
                                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow"
                                >×</button>
                                {p.type === "video" && (
                                    <div className="absolute bottom-0.5 left-0.5 bg-black/60 text-white text-[9px] px-1 rounded">VID</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 rounded-xl font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {submitting ? (
                    <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Submitting…
                    </>
                ) : "Submit Review"}
            </button>
        </form>
    );
};

/* ─── Main Page ───────────────────────────────────────── */
const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const frontendUrl = window.location.href;
    const backendUrl = API.defaults.baseURL.replace(/\/api\/?$/, "");
    const shareUrl = product 
        ? `${backendUrl}/api/products/share/${product._id}?redirect=${encodeURIComponent(frontendUrl)}`
        : frontendUrl;

    const handleShare = async () => {
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

    useEffect(() => {
        API.get(`/products/${id}`)
            .then(({ data }) => setProduct(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        API.get(`/reviews/${id}`)
            .then(({ data }) => setReviews(data))
            .catch(console.error)
            .finally(() => setReviewsLoading(false));
    }, [id]);

    useEffect(() => {
        if (product?.category) {
            setRelatedLoading(true);
            API.get(`/products?category=${product.category}&limit=5`)
                .then(({ data }) => {
                    const filtered = data.filter(p => p._id !== id);
                    setRelatedProducts(filtered.slice(0, 4));
                })
                .catch(console.error)
                .finally(() => setRelatedLoading(false));
        }
    }, [product, id]);

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    if (loading)
        return (
            <div className="container mx-auto px-4 py-10 animate-pulse space-y-6">
                <div className="w-16 h-4 bg-slate-100 rounded-full" />
                <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl bg-slate-100" />
                <div className="space-y-3">
                    <div className="h-5 bg-slate-100 rounded-full w-1/3" />
                    <div className="h-8 bg-slate-100 rounded-full w-2/3" />
                    <div className="h-4 bg-slate-100 rounded-full" />
                    <div className="h-4 bg-slate-100 rounded-full w-4/5" />
                </div>
            </div>
        );

    if (!product)
        return (
            <div className="container mx-auto px-4 py-40 text-center text-slate-400 text-lg">
                Product not found.
            </div>
        );

    const discount = product.discountPrice
        ? Math.round((1 - product.discountPrice / product.price) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-6 sm:py-10 md:py-16 animate-fade-up">

            <Helmet>
                <title>{product.title} - ShopKart</title>
                <meta name="description" content={product.description} />
                <meta property="og:title" content={`${product.title} - ShopKart`} />
                <meta property="og:description" content={product.description} />
                {product.images && product.images[0] && (
                    <meta property="og:image" content={product.images[0]} />
                )}
                <meta property="og:url" content={frontendUrl} />
                <meta property="og:type" content="product" />
                <meta name="twitter:card" content="summary_large_image" />
                {product.images && product.images[0] && (
                    <meta name="twitter:image" content={product.images[0]} />
                )}
            </Helmet>

            {/* Back */}
            <Link to="/shop" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-violet-600 text-sm font-medium mb-6 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Shop
            </Link>

            {/* Product Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                {/* Left — Slider (full width on mobile, half on desktop) */}
                <div className="w-full lg:w-1/2">
                    <ImageSlider images={product.images} />
                </div>

                {/* Right — Info */}
                <div className="w-full lg:w-1/2 space-y-5">
                    {/* Category badge */}
                    <span className="inline-block text-violet-600 font-black uppercase tracking-widest text-[10px] sm:text-xs bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                        {product.category}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                        {product.title}
                    </h1>

                    {/* Rating bar */}
                    {avgRating && (
                        <div className="flex flex-wrap items-center gap-2">
                            <StarRating value={Math.round(Number(avgRating))} size="sm" />
                            <span className="text-slate-700 font-black text-sm">{avgRating}</span>
                            <span className="text-slate-400 text-xs">
                                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                            </span>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed">{product.description}</p>

                    {/* Price row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-3xl sm:text-4xl font-black gradient-text">
                            ₹{product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                            <>
                                <span className="text-lg sm:text-xl text-slate-300 line-through">₹{product.price}</span>
                                <span className="text-emerald-600 font-black text-xs sm:text-sm bg-emerald-50 px-2.5 py-1 rounded-full">
                                    {discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${product.stock > 0 ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className={`text-xs sm:text-sm font-bold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {product.stock > 0 ? `In Stock — ${product.stock} left` : "Out of Stock"}
                        </span>
                    </div>

                    {/* Buttons — full-width on mobile, side-by-side on sm+ */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="btn-secondary py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Add to Cart</span>
                        </button>
                        <button
                            onClick={() => navigate("/checkout", { state: { directItem: { ...product, qty: 1 } } })}
                            disabled={product.stock === 0}
                            className="btn-primary py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-200"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Buy Now</span>
                        </button>
                    </div>

                    {/* Share Button Block */}
                    <button
                        onClick={handleShare}
                        className="w-full mt-3 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-slate-600 font-bold text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share this Product</span>
                    </button>

                    <p className="text-center text-slate-300 text-xs">🚚 Free shipping on all premium items</p>
                </div>
            </div>

            {/* ── Reviews ──────────────────────────────────── */}
            <div className="mt-12 sm:mt-16 space-y-6">
                {/* Section header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Customer Reviews</h2>
                        {avgRating ? (
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <StarRating value={Math.round(Number(avgRating))} />
                                <span className="text-xl font-black gradient-text">{avgRating}</span>
                                <span className="text-slate-400 text-sm">/ 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm mt-1">No reviews yet — be the first!</p>
                        )}
                    </div>
                </div>

                {/* On mobile: form on top (user sees it first), reviews below */}
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">

                    {/* Review list */}
                    <div className="lg:col-span-2 space-y-4">
                        {reviewsLoading ? (
                            [1, 2].map((i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 animate-pulse space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                                        <div className="space-y-1.5 flex-1">
                                            <div className="h-3 bg-slate-100 rounded-full w-24" />
                                            <div className="h-2 bg-slate-100 rounded-full w-16" />
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full" />
                                    <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                                </div>
                            ))
                        ) : reviews.length === 0 ? (
                            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                                <div className="text-5xl mb-3">💬</div>
                                <p className="text-slate-500 font-bold">No reviews yet</p>
                                <p className="text-slate-300 text-sm mt-1">Share your experience!</p>
                            </div>
                        ) : (
                            reviews.map((review) => <ReviewCard key={review._id} review={review} />)
                        )}
                    </div>

                    {/* Submit form / login prompt */}
                    <div className="lg:col-span-1">
                        {user ? (
                            <ReviewForm productId={id} onSuccess={(r) => setReviews((p) => [r, ...p])} />
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-4 shadow-sm">
                                <div className="text-4xl">🔒</div>
                                <p className="text-slate-700 font-bold text-sm">Login to Write a Review</p>
                                <Link to="/login" className="btn-primary inline-block px-5 py-2.5 rounded-xl font-black text-sm">
                                    Login Now
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Related Products ─────────────────────────── */}
            <div className="mt-20 sm:mt-24 space-y-8 animate-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                        <p className="text-violet-600 font-bold text-xs uppercase tracking-widest mb-1.5">You May Also Like</p>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Related Products</h2>
                    </div>
                    <Link to="/shop" className="text-violet-600 font-black text-sm flex items-center gap-1.5 hover:gap-3 transition-all group">
                        See More
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {relatedLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-2xl h-64 bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {relatedProducts.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-slate-400 font-medium">No related products found in this category.</p>
                    </div>
                )}
            </div>

            {product && (
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    product={product}
                    shareUrl={shareUrl}
                />
            )}
        </div>
    );
};

export default ProductDetails;
