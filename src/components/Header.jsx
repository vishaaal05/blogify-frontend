import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // install lucide-react for icons

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const hideLogin =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/author/dashboard" ||
    location.pathname === "/user/dashboard";

  return (
    <header className="bg-white shadow-sm px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-red-500">
          <Link to="/home">Blogify</Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-gray-600 hover:text-red-500 hover:underline">
            Home
          </Link>
          <Link to="/blogs" className="text-gray-600 hover:text-red-500 hover:underline">
            Blog
          </Link>
          <Link to="/Contactus" className="text-gray-600 hover:text-red-500 hover:underline">
            Reach us
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-red-500 hover:underline">
            About
          </Link>
          {!hideLogin && (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col mt-3 space-y-2">
          <Link to="/home" className="text-gray-600 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/blogs" className="text-gray-600 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>
            Blog
          </Link>
          <Link to="/Contactus" className="text-gray-600 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>
            Reach us
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-red-500" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          {!hideLogin && (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition w-fit"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
