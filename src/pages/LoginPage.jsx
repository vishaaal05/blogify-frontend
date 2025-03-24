import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "../components/Header";
import Button from "../components/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Add your login logic here (e.g., API call)
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <Header />

      {/* Login Section */}
      <motion.section
        className="relative py-20 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Decorative Shape */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50"></div>

        {/* Form Container */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your password"
                required
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <Button label="Log In" type="submit" />
            </motion.div>
          </form>

          {/* Link to SignUp */}
          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-red-500 hover:underline">
              Sign Up
            </a>
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default LoginPage;