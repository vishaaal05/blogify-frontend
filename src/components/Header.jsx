import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

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
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 transition-all duration-300 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/home" onClick={closeMenu} className="text-red-500 hover:text-red-600 transition-colors">
              Blogify
            </Link>
          </motion.div>

          {/* Hamburger Icon (mobile only) */}
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden sm:flex items-center space-x-8">
            {["Home", "Blog", "Reach us", "About"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/${item.toLowerCase().replace(" ", "")}`}
                  className="text-gray-600 hover:text-red-500 transition-colors font-medium"
                >
                  {item}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Login
                </Link>
              )}
            </motion.div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.nav
        className={`sm:hidden ${menuOpen ? 'block' : 'hidden'}`}
        initial={false}
        animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="mt-4 flex flex-col gap-4">
          <Link to="/home" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Home
          </Link>
          <Link to="/blog" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
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
      </motion.nav>
    </header>
  );
};
