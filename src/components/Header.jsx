import React from 'react'
import { useState } from 'react';
import Button from "../components/Button";
export const Header = ({label}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div>      {/* Header */}
    <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm">
      <div className="text-2xl font-bold text-red-500">Blogify</div>
      <nav className="space-x-6">
        <a href="#" className="text-gray-600 hover:text-red-500">
          Home
        </a>
        <a href="#" className="text-gray-600 hover:text-red-500">
          Category
        </a>
        <a href="#" className="text-gray-600 hover:text-red-500">
        About
        </a>
        <a href="#" className="text-gray-600 hover:text-red-500">
          Contact
        </a>
      </nav>
      <div className='flex gap-8'>
      <Button
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className=" bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        label="Login"
      >
        {isLoggedIn ? "Logout" : "Login"}
      </Button>
      <Button
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className="px- py- bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        label="Sign up"
      >
        {isLoggedIn ? "Logout" : "Login"}
      </Button>
      </div>
      
    </header></div>
  )
}
