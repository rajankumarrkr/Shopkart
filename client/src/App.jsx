import AppRoutes from "../routes/AppRoutes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-20">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;