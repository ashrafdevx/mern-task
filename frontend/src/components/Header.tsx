import {
  MapPin,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Search,
  User,
  Menu,
  ChevronDown,
  X,
  ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", hasDropdown: true },
    { label: "Pages", path: "/about", hasDropdown: true },
    { label: "Rooms & Suites", path: "/booking", hasDropdown: true },
    { label: "Services", path: "#", hasDropdown: true },
    { label: "Blog", path: "#", hasDropdown: true },
    { label: "Contact", path: "#", hasDropdown: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full">

      {/* Top Bar - Dark Green */}
      <div className="bg-[#147a5f] text-white py-2.5">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          {/* Left - Contact Info */}
          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">256 Elizaberth Ave Str, Brooklyn, CA, 90025</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">info@example.com</span>
            </div>
          </div>

          {/* Right - Social Icons */}
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      {/* Main Navigation - Dark Theme */}
      <nav className="bg-[#2d2d2d] ">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <img src={"/Logo.png"} alt="Logo" className="  h-20" />

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon - Gray Circle */}
            <button className="w-10 h-10 bg-[#4a4a4a] rounded-full flex items-center justify-center hover:bg-[#5a5a5a] transition-colors">
              <Search className="w-4 h-4 text-white" />
            </button>
            {/* Menu Icon - Gray Circle */}
            <button className="w-10 h-10 bg-[#4a4a4a] rounded-full flex items-center justify-center hover:bg-[#5a5a5a] transition-colors">
              <Menu className="w-4 h-4 text-white" />
            </button>
            {/* Book Your Stay Button - Gold/Yellow */}
            <Link
              to="/booking"
              className="hidden md:inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-5 py-2.5 rounded-md font-medium text-sm hover:bg-secondary/90 transition-colors"
            >
              Book Your Stay
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-[#4a4a4a] rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-white"></span>
                <span className="w-full h-0.5 bg-white"></span>
                <span className="w-full h-0.5 bg-white"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#2d2d2d] border-t border-white/10 mt-4 py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a key={item.label} href="#" className="flex items-center gap-1 text-white/80 hover:text-white py-2 border-b border-white/10 text-sm">
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </a>
              ))}
              <Link to="/booking" className="btn-secondary w-full justify-center mt-2">
                Book Your Stay
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
