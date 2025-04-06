import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { motion } from "framer-motion";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setProfileMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (menuOpen) setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 transition-all duration-300 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div
            className="text-xl sm:text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/home"
              onClick={closeMenu}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              Blogify
            </Link>
          </motion.div>

          {/* Hamburger Icon (mobile only) */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden sm:flex items-center space-x-6 sm:space-x-8">
            {["Home", "Blog", "Reach us", "About"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/${item.toLowerCase().replace(" ", "")}`}
                  className="text-gray-600 hover:text-red-500 transition-colors text-sm sm:text-base font-medium"
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
                    aria-label="Toggle profile menu"
                  >
                    <img
                      src="https://avatar.iran.liara.run/public/boy"
                      alt="Profile"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                    />
                  </button>
                  {profileMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/user/dashboard"
                        onClick={closeMenu}
                        className="block px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                      >
                        Your Dashboard
                      </Link>
                      <Link
                        to="/author/dashboard"
                        onClick={closeMenu}
                        className="block px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                      >
                        Author Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : isLoginPage ? (
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Signup
                </Link>
              ) : isSignupPage ? (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base font-medium"
                >
                  Login
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base font-medium"
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
        className={`sm:hidden ${menuOpen ? "block" : "hidden"}`}
        initial={false}
        animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="mt-2 flex flex-col gap-2 pb-2 bg-white shadow-md">
          <Link
            to="/home"
            onClick={closeMenu}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
          >
            Home
          </Link>
          <Link
            to="/blog"
            onClick={closeMenu}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
          >
            Blog
          </Link>
          <Link
            to="/contactus"
            onClick={closeMenu}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
          >
            Reach us
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
          >
            About
          </Link>

          {isLoggedIn ? (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center px-4 py-2 space-x-2 focus:outline-none"
                aria-label="Toggle profile menu"
              >
                <img
                  src="https://avatar.iran.liara.run/public/boy"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-600 text-sm">Profile</span>
              </button>
              {profileMenuOpen && (
                <motion.div
                  className="flex flex-col gap-1 px-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to="/user/dashboard"
                    onClick={closeMenu}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                  >
                    Your Dashboard
                  </Link>
                  <Link
                    to="/author/dashboard"
                    onClick={closeMenu}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                  >
                    Author Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 text-sm"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : isLoginPage ? (
            <Link
              to="/signup"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm mt-2"
            >
              Signup
            </Link>
          ) : isSignupPage ? (
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm mt-2"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-sm mt-2"
            >
              Login
            </Link>
          )}
        </nav>
      </motion.nav>
    </header>
  );
};