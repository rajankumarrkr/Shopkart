import { useState, useEffect } from "react";
import API from "../api/api";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        discountPrice: ""
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await API.get("/products");
            setProducts(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            alert("Failed to delete product");
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                discountPrice: product.discountPrice || ""
            });
            setPreviews(product.images || []);
            setExistingImages(product.images || []);
        } else {
            setEditingProduct(null);
            setFormData({
                title: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                discountPrice: ""
            });
            setPreviews([]);
            setExistingImages([]);
        }
        setSelectedFiles([]);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (previews.length + files.length > 5) {
            alert("Maximum 5 images allowed per product.");
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        const previewToRemove = previews[index];

        // Check if it's an existing image (URL) or a new preview (blob)
        if (previewToRemove.startsWith('blob:')) {
            // Find which file this belongs to
            const previewIndexInNewFiles = previews.filter(p => p.startsWith('blob:')).indexOf(previewToRemove);
            setSelectedFiles(prev => prev.filter((_, i) => i !== previewIndexInNewFiles));
        } else {
            setExistingImages(prev => prev.filter(img => img !== previewToRemove));
        }

        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("stock", formData.stock);
            if (formData.discountPrice) data.append("discountPrice", formData.discountPrice);

            existingImages.forEach(img => {
                data.append("images", img);
            });

            selectedFiles.forEach(file => {
                data.append("images", file);
            });

            const config = {
                headers: { "Content-Type": "multipart/form-data" }
            };

            if (editingProduct) {
                await API.put(`/products/${editingProduct._id}`, data, config);
            } else {
                await API.post("/products", data, config);
            }

            fetchProducts();
            setShowModal(false);
            alert(`Product ${editingProduct ? "updated" : "added"} successfully!`);
        } catch (error) {
            console.error("Submit error:", error);
            alert(`Failed to ${editingProduct ? "update" : "add"} product: ${error.response?.data?.message || error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black gradient-text mb-2">Inventory Management</h1>
                    <p className="text-slate-400 font-medium">Add, edit, and track your store's products</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn-primary py-4 px-10 shadow-2xl shadow-blue-500/20 flex items-center gap-2 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
                    Add New Product
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-80 glass-card animate-pulse">
                            <div className="h-48 bg-slate-100/50 rounded-xl m-4"></div>
                            <div className="h-4 bg-slate-100/50 rounded w-3/4 mx-4 mb-2"></div>
                            <div className="h-4 bg-slate-100/50 rounded w-1/2 mx-4"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="glass-card flex flex-col group p-4 hover:border-primary/30 transition-all duration-500">
                            <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative bg-slate-50">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-sm">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="bg-white text-primary p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                                        title="Edit Product"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L11.707 14.5a1 1 0 01-.44.278l-3 1a1 1 0 01-1.265-1.265l1-3a1 1 0 01.278-.44l8.303-8.303z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="bg-red-500 text-white p-3 rounded-xl hover:scale-110 transition-transform shadow-xl"
                                        title="Delete Product"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 rounded-full shadow-sm border border-white">
                                        {product.category}
                                    </span>
                                </div>
                            </div>
                            <div className="px-2">
                                <h3 className="font-bold text-slate-800 mb-1 truncate group-hover:text-primary transition-colors">{product.title}</h3>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-2xl font-black text-slate-900">₹{product.price}</p>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${product.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {product.stock} IN STOCK
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
                    <div className="glass-card max-w-2xl w-[95vw] md:w-full p-0 max-h-[95vh] overflow-hidden flex flex-col shadow-3xl animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900">{editingProduct ? "Edit Product" : "New Creation"}</h2>
                                <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Fill in the details for your masterpiece</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. Ultra Gaming Pro"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    className="input-field min-h-[120px] resize-none"
                                    placeholder="Describe the soul of this product..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        required
                                        className="input-field appearance-none"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Choose category</option>
                                        <option value="Tech">Tech & Gadgets</option>
                                        <option value="Fashion">Fashion & Apparel</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Stock Level</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Product Images</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {previews.map((src, i) => (
                                        <div key={i} className="aspect-square rounded-xl border border-slate-100 overflow-hidden bg-slate-50 relative group">
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {previews.length < 5 && (
                                        <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-all group">
                                            <span className="text-2xl text-slate-400 group-hover:scale-110 transition-transform">+</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">Add</span>
                                            <input
                                                type="file"
                                                multiple
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 italic">Select up to 5 high-quality images of your product.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary w-full py-5 text-lg font-black shadow-2xl shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        editingProduct ? "Update Masterpiece" : "Publish Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;

