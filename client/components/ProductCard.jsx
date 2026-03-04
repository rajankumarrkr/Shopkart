import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleBuyNow = () => {
        addToCart(product);
        navigate("/checkout");
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
            <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                    {product.discountPrice ? (
                        <>
                            <span className="text-primary font-bold">₹{product.discountPrice}</span>
                            <span className="text-slate-400 text-xs line-through">₹{product.price}</span>
                        </>
                    ) : (
                        <span className="text-primary font-bold">₹{product.price}</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => addToCart(product)}
                        className="btn-secondary p-2 rounded-lg text-xs flex items-center gap-1 border border-primary/20"
                    >
                        Add
                    </button>
                    <button
                        onClick={handleBuyNow}
                        className="btn-primary p-2 rounded-lg text-xs flex items-center gap-1 shadow-lg shadow-primary/20"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
