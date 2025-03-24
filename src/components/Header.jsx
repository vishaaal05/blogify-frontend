import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="text-2xl font-bold text-red-500"><Link to="/home">Blogify</Link></div>
      <nav className="space-x-6">
        <Link to="/home" className="text-gray-600 hover:text-red-500">
          Home
        </Link>
        <Link to="/blogs" className="text-gray-600 hover:text-red-500">
        Blog
        </Link>
        <Link to="/Contactus" className="text-gray-600 hover:text-red-500">
          Reach us
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-red-500">
          About
        </Link>
      </nav>
      <Link
        to="/login"
        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
      >
        Login
      </Link>
    </header>
  );
};
