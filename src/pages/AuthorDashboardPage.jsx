import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import Loader from "../components/Loader";
import { ChevronDown, ChevronUp } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    },
  },
};

const postVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      type: "spring",
      stiffness: 120,
    },
  },
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        const response = await axios.get(
          `https://blogify-backend-sxn5.onrender.com/v1/api/posts/author/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedPosts = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAuthAndFetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `https://blogify-backend-sxn5.onrender.com/v1/api/posts/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert("Failed to delete post.");
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/update/post/${postId}`);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="large" />
      </div>
    );
  if (error)
    return (
      <div className="py-8 text-sm text-center text-red-500 sm:text-base">
        {error}
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gray-50">
      <Header />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-pink-100 to-white">
        <div className="absolute top-0 right-0 w-3/4 bg-pink-200 rounded-bl-full h-3/4 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/2 bg-pink-100 rounded-tr-full h-1/2 opacity-20"></div>
      </div>

      <motion.section
        className="relative z-10 pt-20 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            className="w-full max-w-5xl p-4 mx-auto bg-white shadow-xl sm:p-6 lg:p-8 rounded-xl"
            variants={itemVariants}
          >
            <motion.div
              className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center sm:mb-8"
              variants={itemVariants}
            >
              <h1 className="text-xl font-bold text-transparent text-gray-800 sm:text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                Welcome, {user?.email.split("@")[0] || "User"}!
              </h1>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
              variants={itemVariants}
            >
              <motion.div
                className="p-4 rounded-lg shadow-md bg-gradient-to-br from-gray-50 to-gray-100 sm:p-6"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="mb-3 text-base font-semibold text-gray-800 sm:text-lg md:text-xl sm:mb-4">
                  Your Profile
                </h2>
                <p className="text-sm text-gray-600 truncate sm:text-base">
                  Email: <span className="font-medium">{user?.email || "N/A"}</span>
                </p>
                <p className="text-sm text-gray-600 sm:text-base">
                  ID: <span className="font-medium">{user?.id || "N/A"}</span>
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  Activity Overview
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {}}
                    className="bg-gray-200 p-3 rounded-md text-center hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">{posts.length}</span>
                    <span className="text-xs">Total Posts</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-gray-200 p-3 rounded-md text-center hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">Coming Soon</span>
                    <span className="text-xs">Likes Received</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 sm:mt-8">
              <h2 className="mb-3 text-lg font-semibold text-transparent text-gray-800 sm:text-xl md:text-2xl sm:mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                Your Posts
              </h2>
              {posts.length === 0 ? (
                <motion.div
                  className="p-4 bg-white rounded-lg shadow-md"
                  variants={itemVariants}
                >
                  <p className="text-sm text-gray-600 sm:text-base">
                    You haven’t created any posts yet.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      variants={postVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <h3 className="text-base font-semibold text-gray-800 truncate sm:text-lg">
                          {post.title}
                        </h3>
                        <p
                          className="mt-1 text-sm text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: post.content.substring(0, 100) + "...",
                          }}
                        />
                        <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                          Status:{" "}
                          <span
                            className={
                              post.status === "published"
                                ? "text-green-500"
                                : "text-yellow-500"
                            }
                          >
                            {post.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleUpdatePost(post.id)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-all duration-200 text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition-all duration-200 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div className="mt-6 sm:mt-8" variants={itemVariants}>
              <h2 className="mb-3 text-lg font-semibold text-transparent text-gray-800 sm:text-xl md:text-2xl sm:mb-4 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text">
                Quick Links
              </h2>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/create/post"
                  className="px-4 py-2 text-sm text-white transition-all duration-200 bg-blue-500 rounded-full hover:bg-blue-600 sm:text-base"
                >
                  Create New Post
                </Link>
                <Link
                  to="/user/dashboard"
                  className="px-4 py-2 text-sm text-white transition-all duration-200 bg-red-500 rounded-full hover:bg-red-600 sm:text-base"
                >
                  User Dashboard
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default DashboardPage;