import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-red-500">
          <Link to="/home" onClick={closeMenu}>Blogify</Link>
        </div>

        {/* Hamburger Icon (mobile only) */}
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Nav links (desktop) */}
        <nav className="hidden sm:flex gap-6 items-center">
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

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="sm:hidden mt-4 flex flex-col gap-4">
          <Link to="/home" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Home
          </Link>
          <Link to="/blogs" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Blog
          </Link>
          <Link to="/Contactus" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Reach us
          </Link>
          <Link to="/about" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            About
          </Link>

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
