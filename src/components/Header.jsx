import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="text-2xl font-bold text-red-500 mb-2 sm:mb-0">
        <Link to="/home">Blogify</Link>
      </div>

      <nav className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <Link
          to="/home"
          className="text-gray-600 hover:text-red-500 hover:underline"
        >
          Home
        </Link>
        <Link
          to="/blogs"
          className="text-gray-600 hover:text-red-500 hover:underline"
        >
          Blog
        </Link>
        <Link
          to="/Contactus"
          className="text-gray-600 hover:text-red-500 hover:underline"
        >
          Reach us
        </Link>
        <Link
          to="/about"
          className="text-gray-600 hover:text-red-500 hover:underline"
        >
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
    </header>
  );
};
