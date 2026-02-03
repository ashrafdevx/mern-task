import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const exploreLinks = [
    { label: "About Hotel", path: "/about" },
    { label: "News & Blog", path: "#" },
    { label: "Our Partner", path: "#" },
    { label: "Our Team", path: "/about" },
    { label: "Booking", path: "/booking" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic
    console.log("Subscribe:", email);
  };

  return (
    <footer className="bg-[#1a1a1a] text-[#9ca3af]">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Logo & Description */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              {/* Building Icon */}

              <span
                className="text-[28px] font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Fixyland
              </span>
            </Link>
            <p className="text-[14px] mb-6 leading-[1.8]">
              Dolor sit amet consectetur adipis cing elit sed do eiusmod tempor incididunt ut labore dolore.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 border border-[#374151] flex items-center justify-center hover:bg-[#1a9876] hover:border-[#1a9876] transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-[#374151] flex items-center justify-center hover:bg-[#1a9876] hover:border-[#1a9876] transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-[#374151] flex items-center justify-center hover:bg-[#1a9876] hover:border-[#1a9876] transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-[#374151] flex items-center justify-center hover:bg-[#1a9876] hover:border-[#1a9876] transition-colors"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-[18px] font-bold text-white mb-6">EXPLORE</h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[14px] text-[#9ca3af] hover:text-[#1a9876] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[18px] font-bold text-white mb-6">CONTACT</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1a9876] flex-shrink-0 mt-0.5" />
                <span className="text-[14px]">256 Elizaberth Ave Str, Brooklyn, NY, US 90025</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1a9876] flex-shrink-0" />
                <span className="text-[14px]">(+1) 307 555 0133</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#1a9876] flex-shrink-0" />
                <span className="text-[14px]">INFO@FLEYLAND.COM</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[18px] font-bold text-white mb-6">NEWSLETTER</h3>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#2d2d2d] border border-[#374151] rounded px-4 py-3 text-[14px] text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1a9876] mb-3"
              />
              <button
                type="submit"
                className="w-full bg-[#1a9876] text-white py-3 rounded font-semibold text-[14px] hover:bg-[#147a5f] transition-colors"
              >
                Subscribe
              </button>
            </form>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <div
                className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${agreed ? 'bg-[#1a9876] border-[#1a9876]' : 'border-[#374151]'
                  }`}
                onClick={() => setAgreed(!agreed)}
              >
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-[13px] text-[#9ca3af]">I agree to all terms and conditions</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#374151]">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-center md:text-left">
            © Copyright 2025 Fleyland. All Rights Reserved
          </p>
          <div className="flex items-center gap-2 text-[13px]">
            <a href="#" className="hover:text-[#1a9876] transition-colors">Terms and Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a9876] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
