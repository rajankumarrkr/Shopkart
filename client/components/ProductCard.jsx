import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleBuyNow = () => {
        const item = { ...product, qty: 1 };
        navigate("/checkout", { state: { directItem: item } });
    };

    return (
        <div className="glass-card flex flex-col h-full group">
            <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
                <img
                    src={product.images[0] || "https://via.placeholder.com/400?text=Product+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.discountPrice && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        SALE
                    </span>
                )}
            </div>
            <div className="flex-grow">
                <h3 className="text-lg font-bold mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-slate-500 text-xs mb-3 line-clamp-2">{product.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-3">
                <div className="flex flex-col">
                    {product.discountPrice ? (
                        <>
                            <span className="text-primary font-black text-lg">₹{product.discountPrice}</span>
                            <span className="text-slate-400 text-[10px] line-through">₹{product.price}</span>
                        </>
                    ) : (
                        <span className="text-primary font-black text-lg">₹{product.price}</span>
                    )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => addToCart(product)}
                        className="btn-secondary flex-1 sm:px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border border-primary/20"
                    >
                        Add
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="btn-primary flex-1 sm:px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 shadow-lg shadow-primary/10"
                    >
                        Buy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
