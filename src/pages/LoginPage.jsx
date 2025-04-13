import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import Button from "../components/Button";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/users/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      toast.success("Welcome back! Login successful!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#dcfce7",
          color: "#166534",
        },
      });
      
      // Get return URL from query parameters
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      
      // Redirect after brief delay
      setTimeout(() => {
        navigate(returnUrl || '/user/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed!";
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#fee2e2",
          color: "#dc2626",
        },
      });
      setFormData({ email: "", password: "" });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hover: { scale: 1.03, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)" },
    focus: {
      scale: 1.03,
      borderColor: "#f43f5e",
      boxShadow: "0px 0px 8px rgba(244, 63, 94, 0.5)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-sans bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Header />
      <Toaster />
      <motion.section
        className="relative z-10 w-full max-w-lg px-6 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Creative Background Shape */}
        <div className="absolute inset-0 transform scale-125 rounded-full -z-10 bg-gradient-to-r from-rose-200 to-pink-300 blur-3xl opacity-40"></div>

        <motion.div
          className="p-8 bg-white border shadow-xl rounded-2xl border-rose-100"
          variants={itemVariants}
        >
          <motion.h2
            className="mb-6 text-4xl font-extrabold text-center text-transparent text-gray-800 bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-gray-700"
              >
                Email Address
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 transition-all border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-0"
                placeholder="you@example.com"
                required
                disabled={loading}
                variants={inputVariants}
                whileHover="hover"
                whileFocus="focus"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-700"
              >
                Password
              </label>
              <motion.input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 transition-all border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-0"
                placeholder="••••••••"
                required
                disabled={loading}
                variants={inputVariants}
                whileHover="hover"
                whileFocus="focus"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <Button
                label={loading ? "Logging In..." : "Log In"}
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              />
            </motion.div>
          </form>

          <motion.p
            className="mt-6 text-sm text-center text-gray-600"
            variants={itemVariants}
          >
            New to the journey?{" "}
            <Link
              to="/signup"
              className="font-medium transition text-rose-500 hover:text-rose-600"
            >
              Sign Up
            </Link>
          </motion.p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default LoginPage;
