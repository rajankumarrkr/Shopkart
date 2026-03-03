import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

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
                            <span className="text-primary font-bold">${product.discountPrice}</span>
                            <span className="text-slate-400 text-xs line-through">${product.price}</span>
                        </>
                    ) : (
                        <span className="text-primary font-bold">${product.price}</span>
                    )}
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="btn-primary p-2 rounded-lg text-xs flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
