import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/users/register",
        formData
      );
      alert("Registered successfully!");
      setSuccess("User registered successfully!");
      setFormData({ name: "", email: "", password: "" });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut", 
        staggerChildren: 0.3 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    },
  };

  const inputVariants = {
    hover: { scale: 1.02 },
    focus: { 
      scale: 1.02,
      borderColor: "#ef4444",
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <motion.section
        className="relative py-16 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Decorative Shape */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50"></div>

        <motion.div 
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 text-center mb-6"
            variants={itemVariants}
          >
            Join the Journey
          </motion.h2>

          {error && (
            <motion.p 
              className="text-red-500 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p 
              className="text-green-500 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Full Name
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your name"
                required
                variants={inputVariants}
                whileHover="hover"
                whileFocus="focus"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email Address
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your email"
                required
                variants={inputVariants}
                whileHover="hover"
                whileFocus="focus"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                placeholder="Enter your password"
                required
                variants={inputVariants}
                whileHover="hover"
                whileFocus="focus"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                label={loading ? "Signing up..." : "Sign up"} 
                type="submit" 
                disabled={loading} 
              />
            </motion.div>
          </form>

          <motion.p 
            className="text-center text-gray-600 mt-6"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <Link 
              to='/login' 
              className="text-red-500 hover:underline"
            >
              Log in
            </Link>
          </motion.p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SignUpPage;