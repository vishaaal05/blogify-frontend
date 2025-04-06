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
    transition: { duration: 0.5, type: "spring", stiffness: 100 },
  },
};

const postVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, type: "spring", stiffness: 120 },
  },
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [favoritedPosts, setFavoritedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLiked, setShowLiked] = useState(false);
  const [showFavorited, setShowFavorited] = useState(false);
  const [showCommented, setShowCommented] = useState(false);
  const [showUserPosts, setShowUserPosts] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        const postsResponse = await axios.get(
          "https://blogify-backend-sxn5.onrender.com/v1/api/posts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allPosts = Array.isArray(postsResponse.data.data)
          ? postsResponse.data.data
          : Array.isArray(postsResponse.data)
          ? postsResponse.data
          : [];

        setLikedPosts(
          allPosts.filter((post) =>
            post.likes?.some((like) => like.userId === decoded.id)
          )
        );
        setFavoritedPosts(
          allPosts.filter((post) =>
            post.favoritedBy?.some((fav) => fav.userId === decoded.id)
          )
        );
        setCommentedPosts(
          allPosts.filter((post) =>
            post.comments?.some((comment) => comment.userId === decoded.id)
          )
        );

        const authorResponse = await axios.get(
          `https://blogify-backend-sxn5.onrender.com/v1/api/posts/author/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userPostsData = Array.isArray(authorResponse.data.data)
          ? authorResponse.data.data
          : Array.isArray(authorResponse.data)
          ? authorResponse.data
          : [];
        setUserPosts(userPostsData);

        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard. Please try again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const renderPostSection = (title, posts, isOpen, toggleOpen) => (
    <motion.div
      variants={itemVariants}
      className="mt-6 bg-white p-4 rounded-lg shadow-md"
    >
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center text-lg md:text-xl font-semibold text-gray-800 mb-3 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent focus:outline-none"
      >
        {title} ({posts.length})
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {posts.length === 0 ? (
          <p className="text-gray-600 text-sm">No posts in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                variants={postVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-800 truncate">
                    {post.title}
                  </h3>
                  <p
                    className="text-gray-600 text-sm mt-1 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: post.content.substring(0, 100) + "...",
                    }}
                  />
                  <p className="text-gray-500 text-xs mt-2">
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
                <Link
                  to={`/blog/${post.id}`}
                  className="mt-3 bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition-all duration-200 text-sm self-start"
                >
                  View
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="large" />
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 text-red-500 text-sm">{error}</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      <Header />
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white z-0">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-pink-100 rounded-bl-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-red-100 rounded-tr-full opacity-10"></div>
      </div>

      <motion.section
        className="pt-20 pb-12 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-xl w-full max-w-5xl mx-auto"
            variants={itemVariants}
          >
            {/* Header Section */}
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
              variants={itemVariants}
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Welcome, {user?.email.split("@")[0] || "User"}!
              </h1>
            </motion.div>

            {/* Profile and Activity Overview */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
              variants={itemVariants}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  Your Profile
                </h2>
                <p className="text-gray-600 text-sm truncate">
                  Email: <span className="font-medium">{user?.email || "N/A"}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  ID: <span className="font-medium">{user?.id || "N/A"}</span>
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  Activity Overview
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setShowLiked(!showLiked)}
                    className="bg-gray-200 p-3 rounded-md text-center  hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">{likedPosts.length}</span>
                    <span className="text-xs">Likes given</span>
                  </button>
                  <button
                    onClick={() => setShowFavorited(!showFavorited)}
                    className="bg-gray-200 p-3 rounded-md text-center hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">{favoritedPosts.length}</span>
                    <span className="text-xs">Favorited</span>
                  </button>
                  <button
                    onClick={() => setShowCommented(!showCommented)}
                    className="bg-gray-200 p-3 rounded-md text-center hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">{commentedPosts.length}</span>
                    <span className="text-xs">Commented</span>
                  </button>
                  <button
                    onClick={() => setShowUserPosts(!showUserPosts)}
                    className="bg-gray-200 p-3 rounded-md text-center hover:bg-gray-500 transition-colors"
                  >
                    <span className="block text-2xl font-bold">{userPosts.length}</span>
                    <span className="text-xs">Posts</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Post Sections */}
            <div className="space-y-6">
              {renderPostSection("Your Posts", userPosts, showUserPosts, () => setShowUserPosts(!showUserPosts))}
              {renderPostSection("Liked Posts", likedPosts, showLiked, () => setShowLiked(!showLiked))}
              {renderPostSection("Favorited Posts", favoritedPosts, showFavorited, () => setShowFavorited(!showFavorited))}
              {renderPostSection("Commented Posts", commentedPosts, showCommented, () => setShowCommented(!showCommented))}
            </div>

            {/* Quick Links */}
            <motion.div className="mt-6" variants={itemVariants}>
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                Quick Links
              </h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/blogs"
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-all duration-200 text-sm"
                >
                  View All Blogs
                </Link>
                {userPosts.length > 0 ? (
                  <Link
                    to="/author/dashboard"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 text-sm"
                  >
                    Author Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/create/post"
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all duration-200 text-sm"
                  >
                    Become an Author
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default UserDashboard;