import { motion } from "framer-motion";
import { useState } from "react";
import { Header } from "../components/Header";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/users/login",
        formData,
        { withCredentials: true }
      );

      // Wait a bit to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify token is in cookies
      const token = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("token="));

      if (!token) {
        throw new Error("No token received");
      }

      console.log("Login successful:", response.data);
      console.log("Token received:", token);

      // Use replace instead of push to prevent going back to login
      await navigate("/user/dashboard", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed!";
      console.error("Login error:", err);
      setError(errorMessage);
      alert(errorMessage);
      setFormData({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
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
        className="relative py-16 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
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

            {/* Error Message */}
            {error && (
              <motion.p
                className="text-red-500 text-center"
                variants={itemVariants}
              >
                {error}
              </motion.p>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <Button
                label={loading ? "Logging in..." : "Log In"}
                type="submit"
                disabled={loading}
              />
            </motion.div>
          </form>

          {/* Link to SignUp */}
          <p className="text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default LoginPage;
