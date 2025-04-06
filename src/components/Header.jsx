import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react"; // Added User icon for profile
import { motion } from "framer-motion";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // State for profile dropdown
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status on mount and route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (profileMenuOpen) setProfileMenuOpen(false); // Close profile menu if open
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (menuOpen) setMenuOpen(false); // Close mobile menu if open
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

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
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src="https://avatar.iran.liara.run/public/boy" // Placeholder profile image
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  </button>
                  {profileMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/user/dashboard"
                        onClick={closeMenu}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500"
                      >
                        Your Dashboard
                      </Link>
                      <Link
                        to="/author/dashboard"
                        onClick={closeMenu}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500"
                      >
                        Author Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : isLoginPage ? (
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Signup
                </Link>
              ) : isSignupPage ? (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
                >
                  Login
                </Link>
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
        <nav className="mt-4 flex flex-col gap-4 pb-4">
          <Link to="/home" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Home
          </Link>
          <Link to="/blog" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Blog
          </Link>
          <Link to="/contactus" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            Reach us
          </Link>
          <Link to="/about" onClick={closeMenu} className="text-gray-600 hover:text-red-500 hover:underline">
            About
          </Link>

          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <img
                  src="https://via.placeholder.com/40" // Placeholder profile image
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-600">Profile</span>
              </div>
              <Link
                to="/user/dashboard"
                onClick={closeMenu}
                className="text-gray-600 hover:text-red-500 hover:underline pl-12"
              >
                Your Dashboard
              </Link>
              <Link
                to="/author/dashboard"
                onClick={closeMenu}
                className="text-gray-600 hover:text-red-500 hover:underline pl-12"
              >
                Author Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : isLoginPage ? (
            <Link
              to="/signup"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
            >
              Signup
            </Link>
          ) : isSignupPage ? (
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
            >
              Login
            </Link>
          )}
        </nav>
      </motion.nav>
    </header>
  );
};