import { useState, useEffect } from "react";
import API from "../api/api";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: "", description: "", price: "", category: "", stock: "", images: [""]
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await API.get("/products");
            setProducts(data);
        } catch (error) {
            console.error(error);
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

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await API.post("/products", newProduct);
            fetchProducts();
            setShowAddModal(false);
            setNewProduct({ title: "", description: "", price: "", category: "", stock: "", images: [""] });
        } catch (error) {
            alert("Failed to add product");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-black">Manage Inventory</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary py-3 px-8 shadow-xl"
                >
                    + Add New Product
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-64 glass-card animate-pulse bg-slate-50"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="glass-card flex flex-col group p-4">
                            <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    🗑️
                                </button>
                            </div>
                            <h3 className="font-bold text-sm mb-1 truncate">{product.title}</h3>
                            <p className="text-primary font-black text-lg">${product.price}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 p-1 bg-slate-50 rounded border border-slate-100">{product.category}</span>
                                <span className="text-xs font-bold text-slate-500">Stock: {product.stock}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass-card max-w-2xl w-full p-10 max-h-[90vh] overflow-y-auto relative animate-fade-up">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-2xl">✕</button>
                        <h2 className="text-2xl font-black mb-8">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Title</label>
                                    <input type="text" required className="input-field" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price ($)</label>
                                    <input type="number" required className="input-field" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                                <textarea required className="input-field min-h-[100px]" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                                    <select required className="input-field" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                        <option value="">Select Category</option>
                                        <option value="Tech">Tech</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Home">Home</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Stock</label>
                                    <input type="number" required className="input-field" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                                <input type="text" required className="input-field" value={newProduct.images[0]} onChange={e => setNewProduct({ ...newProduct, images: [e.target.value] })} />
                            </div>
                            <button type="submit" className="btn-primary w-full py-4 text-lg">Create Product</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
