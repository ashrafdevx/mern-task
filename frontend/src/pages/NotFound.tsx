import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          {/* 404 Illustration */}
          <div className="relative mb-8">
            <span 
              className="text-[10rem] md:text-[14rem] font-bold text-primary/10 leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-3xl">F</span>
              </div>
            </div>
          </div>

          <h1 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let us help you find your way.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link to="/booking" className="btn-secondary inline-flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Rooms
            </Link>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">Helpful links:</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link to="/" className="text-primary hover:underline">Home</Link>
              <Link to="/about" className="text-primary hover:underline">About Us</Link>
              <Link to="/booking" className="text-primary hover:underline">Rooms & Suites</Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
