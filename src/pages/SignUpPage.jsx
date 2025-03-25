import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import Button from "../components/Button";

const SignUpPage = () => {
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
      
      setSuccess("User registered successfully!");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <motion.section
        className="relative py-20 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Join the Journey
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button label={loading ? "Signing up..." : "Sign up"} type="submit" disabled={loading} />
            </motion.div>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account? <a href="/login" className="text-red-500 hover:underline">Log In</a>
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default SignUpPage;
