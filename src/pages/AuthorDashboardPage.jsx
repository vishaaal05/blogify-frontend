import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { motion } from "framer-motion";
import { Header } from "../components/Header";

// Animation Variants
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const postVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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
        // Decode token to get user info
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setUser(decoded);

        // Fetch user's posts
        const response = await axios.get(
          `https://blogify-backend-sxn5.onrender.com/v1/api/posts/author/${decoded.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Raw API Response:", response.data);

        // Extract the 'data' array from response.data
        const fetchedPosts = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setPosts(fetchedPosts);
        console.log("Set Posts:", fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
      alert("Failed to delete post.");
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/update/post/${postId}`);
  };

  if (loading)
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header/>
      <motion.section
        className="relative py-16 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50 z-0"></div>

        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl z-10"
          variants={itemVariants}
        >
          <motion.div
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Welcome, {user?.email || "User"}!
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Profile
              </h2>
              <p className="text-gray-600">
                Email:{" "}
                <span className="font-medium">{user?.email || "N/A"}</span>
              </p>
              <p className="text-gray-600">
                ID: <span className="font-medium">{user?.id || "N/A"}</span>
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Stats
              </h2>
              <p className="text-gray-600">
                Posts Created:{" "}
                <span className="font-medium">{posts.length}</span>
              </p>
              <p className="text-gray-600">
                Likes Received: <span className="font-medium">Coming Soon</span>
              </p>
            </motion.div>
          </motion.div>

          {/* User's Posts */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Posts
            </h2>
            {posts.length === 0 ? (
              <p className="text-gray-600">
                You haven’t created any posts yet.
              </p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                    variants={postVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {post.content.substring(0, 100)}...
                      </p>
                      <p className="text-gray-500 text-sm">
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdatePost(post.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div className="mt-8" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quick Links
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/create/post"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Create New Post
              </Link>
              <Link
                to="/user/dashboard"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Go to user dashboard
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default DashboardPage;
