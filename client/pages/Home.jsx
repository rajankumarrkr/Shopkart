import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>
        <div className="container mx-auto px-4 z-10 text-center animate-fade-up">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            Elevate Your <span className="gradient-text">Lifestyle.</span>
          </h1>
          <p className="text-slate-600 text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light">
            Discover a curated collection of premium products designed for the modern individual.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-lg px-10">Shop Now</Link>
            <Link to="/auth/login" className="btn-secondary text-lg px-10">Join Community</Link>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
            <p className="text-slate-400">Handpicked for exceptional quality.</p>
          </div>
          <Link to="/shop" className="text-primary font-semibold hover:underline">View All &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card h-80 animate-pulse bg-slate-100"></div>
            ))
          )}
        </div>
      </section>

      {/* Categories / Teaser */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card h-96 flex flex-col justify-end p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Tech" />
            <div className="z-20">
              <h3 className="text-3xl font-bold mb-2">Premium Tech</h3>
              <p className="text-slate-200/90 mb-6">Upgrade your workspace with our latest arrivals.</p>
              <Link to="/shop?category=tech" className="btn-primary py-2 px-6 text-sm inline-block">Explore</Link>
            </div>
          </div>
          <div className="glass-card h-96 flex flex-col justify-end p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Fashion" />
            <div className="z-20">
              <h3 className="text-3xl font-bold mb-2">Urban Style</h3>
              <p className="text-white/60 mb-6">Redefine your wardrobe with minimalist fashion.</p>
              <Link to="/shop?category=fashion" className="btn-primary py-2 px-6 text-sm inline-block">Explore</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;