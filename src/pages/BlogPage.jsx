import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import Loader from "../components/Loader";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";

// Add this helper function before the BlogPage component
const formatCommentTime = (timestamp) => {
  const commentDate = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - commentDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  return commentDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Animation Variants remain unchanged
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

const commentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://blogify-backend-sxn5.onrender.com/v1/api/posts/${id}`
        );
        setPost(response.data.post);
        setLoading(false);

        const token = localStorage.getItem("token");
        if (token) {
          const userId = JSON.parse(atob(token.split(".")[1])).id;
          setIsLiked(
            response.data.post.likes.some((like) => like.userId === userId)
          );
          setIsFavorited(
            response.data.post.favorites?.some((fav) => fav.userId === userId) || false
          );
        }
      } catch (err) {
        setError("Failed to fetch blog post");
        setLoading(false);
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in to like this post.");
      navigate("/login");
      return;
    }

    try {
      const userId = JSON.parse(atob(token.split(".")[1])).id;
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/likes/toggle",
        { postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost((prevPost) => {
        const newLikes = isLiked
          ? prevPost.likes.filter((like) => like.userId !== userId)
          : [
              ...prevPost.likes,
              {
                id: `${userId}-${id}`,
                userId,
                postId: id,
                createdAt: new Date(),
              },
            ];
        return { ...prevPost, likes: newLikes };
      });
      setIsLiked(!isLiked);

      if (response.data.likes) {
        setPost((prevPost) => ({ ...prevPost, likes: response.data.likes }));
      }
    } catch (err) {
      console.error("Error toggling like:", err.response?.data || err.message);
      alert("Failed to toggle like.");
      setIsLiked(isLiked);
    }
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in to favorite this post.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/favorites/toggle",
        { postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFavorited(!isFavorited);
      alert(isFavorited ? "Removed from favorites!" : "Added to favorites!");

      if (response.data.favorites) {
        setPost((prevPost) => ({
          ...prevPost,
          favorites: response.data.favorites,
        }));
      }
    } catch (err) {
      console.error(
        "Error toggling favorite:",
        err.response?.data || err.message
      );
      alert("Failed to toggle favorite.");
      setIsFavorited(isFavorited);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to comment.");
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/comments/",
        { postId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Parse user data from token
      const userData = JSON.parse(atob(token.split(".")[1]));
      
      const newCommentData = {
        id: response.data.id || Date.now().toString(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email
        }
      };

      setPost((prevPost) => ({
        ...prevPost,
        comments: [newCommentData, ...prevPost.comments],
      }));
      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err.response?.data || err.message);
      alert("Failed to post comment.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader size="large" />
    </div>
  );

  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!post)
    return <div className="text-center py-8 text-gray-600">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <motion.section
        className="relative py-8 md:py-16 px-4 md:px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50 z-0"></div>

        <motion.div
          className="bg-white p-4 md:p-8 rounded-lg shadow-lg w-full max-w-4xl z-10"
          variants={itemVariants}
        >
          <motion.img
            src={
              post.featuredImg ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={post.title}
            className="w-full h-48 md:h-80 object-cover rounded-lg mb-4 md:mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />

          <motion.h1
            className="text-2xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4 text-center"
            variants={itemVariants}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-between text-gray-600 mb-4 md:mb-8 space-y-2 md:space-y-0"
            variants={itemVariants}
          >
            <p className="text-base md:text-lg">
              By{" "}
              <span className="font-semibold text-red-500">
                {post.author?.name || "Unknown Author"}
              </span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">
                {post.readingTime ? `${post.readingTime} min read` : "N/A"}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">
                {post.views} views
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">
                {post.likes.length} likes
              </span>
            </div>
          </motion.div>

          <motion.div className="flex justify-center md:justify-start gap-4 mb-6" variants={itemVariants}>
            <button
              onClick={handleLikeToggle}
              className={`p-3 rounded-full transition-all duration-300 ${
                isLiked 
                ? "bg-red-500 text-white hover:bg-red-600" 
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
            <button
              onClick={handleFavoriteToggle}
              className={`p-3 rounded-full transition-all duration-300 ${
                isFavorited
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {isFavorited ? <FaStar size={20} /> : <FaRegStar size={20} />}
            </button>
          </motion.div>

          <motion.div
            className="prose prose-sm md:prose-lg max-w-none text-gray-700 mb-6 md:mb-10 border-l-4 border-red-500 pl-4 text-left"
            variants={itemVariants}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Comments ({post.comments.length})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                rows="4"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Post Comment
              </button>
            </form>

            {post.comments.length > 0 ? (
              [...post.comments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex gap-4"
                    variants={commentVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-lg">
                      {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.user?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </motion.div>
                ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex justify-between items-center text-sm text-gray-500 mt-8"
            variants={itemVariants}
          >
            <p>
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
            <Link
              to="/blogs"
              className="text-red-500 hover:underline font-semibold"
            >
              Back to Blogs
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default BlogPage;