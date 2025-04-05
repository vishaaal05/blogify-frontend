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

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [favoritedPosts, setFavoritedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
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

        // Fetch all posts for liked, commented, and favorited filtering
        const postsResponse = await axios.get(
          "https://blogify-backend-sxn5.onrender.com/v1/api/posts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Raw Posts Response:", postsResponse.data);
        const allPosts = Array.isArray(postsResponse.data.data)
          ? postsResponse.data.data
          : Array.isArray(postsResponse.data)
          ? postsResponse.data
          : [];
        console.log("Processed allPosts:", allPosts);

        // Filter liked posts
        const liked = allPosts.filter(
          (post) =>
            post.likes &&
            Array.isArray(post.likes) &&
            post.likes.some((like) => like.userId === decoded.id)
        );
        setLikedPosts(liked);

        // Filter favorited posts
        const favorited = allPosts.filter(
          (post) =>
            post.favoritedBy &&
            Array.isArray(post.favoritedBy) &&
            post.favoritedBy.some((fav) => fav.userId === decoded.id)
        );
        setFavoritedPosts(favorited);

        // Filter commented posts
        const commented = allPosts.filter(
          (post) =>
            post.comments &&
            Array.isArray(post.comments) &&
            post.comments.some((comment) => comment.userId === decoded.id)
        );
        setCommentedPosts(commented);

        // Fetch user's own posts
        const authorResponse = await axios.get(
          `https://blogify-backend-sxn5.onrender.com/v1/api/posts/author/${decoded.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Author Posts Response:", authorResponse.data);
        const userPostsData = Array.isArray(authorResponse.data.data)
          ? authorResponse.data.data
          : Array.isArray(authorResponse.data)
          ? authorResponse.data
          : [];
        setUserPosts(userPostsData);

        setLoading(false);
      } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        setError("Failed to load dashboard. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/login");
  // };

  const renderPostSection = (title, posts) => (
    <motion.div variants={itemVariants} className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts in this category yet.</p>
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
                <p
                  className="text-gray-600 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: post.content.substring(0, 100) + "...",
                  }}
                />
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
              <Link
                to={`/blog/${post.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                View
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  if (loading)
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
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
            {/* <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button> */}
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
                Your Activity
              </h2>
              <p className="text-gray-600">
                Liked Posts:{" "}
                <span className="font-medium">{likedPosts.length}</span>
              </p>
              <p className="text-gray-600">
                Favorited Posts:{" "}
                <span className="font-medium">{favoritedPosts.length}</span>
              </p>
              <p className="text-gray-600">
                Commented Posts:{" "}
                <span className="font-medium">{commentedPosts.length}</span>
              </p>
              <p className="text-gray-600">
                Your Posts:{" "}
                <span className="font-medium">{userPosts.length}</span>
              </p>
            </motion.div>
          </motion.div>

          {renderPostSection("Your Posts", userPosts)}
          {renderPostSection("Liked Posts", likedPosts)}
          {renderPostSection("Favorited Posts", favoritedPosts)}
          {renderPostSection("Commented Posts", commentedPosts)}

          <motion.div className="mt-8" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quick Links
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blogs"
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                View All Blogs
              </Link>
              {userPosts.length > 0 ? (
                <Link
                  to="/author/dashboard"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Go to Author Dashboard
                </Link>
              ) : (
                <Link
                  to="/create/post"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Become an Author
                </Link>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default UserDashboard;
