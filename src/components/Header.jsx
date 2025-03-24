import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); 

  // Hide login button on login and signup pages
  const hideLogin = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="text-2xl font-bold text-red-500">
        <Link to="/home">Blogify</Link>
      </div>
      <nav className="space-x-6">
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
      </nav>
      {!hideLogin && (
        <Link
          to="/login"
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          Login
        </Link>
      )}
    </header>
  );
};
