const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-extrabold gradient-text mb-4">SHOPKART</h2>
                        <p className="text-slate-600 max-w-sm mb-6">
                            Experience the future of online shopping with our curated collection of premium products and seamless user experience.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-slate-600">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Newsletter</h3>
                        <div className="flex">
                            <input type="email" placeholder="Email" className="input-field rounded-r-none py-2" />
                            <button className="btn-primary rounded-l-none py-2 px-4 shadow-none">Go</button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} Shopkart. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
