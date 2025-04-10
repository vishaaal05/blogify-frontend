import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import Loader from "../components/Loader";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

// Helper function for formatting comment timestamps
const formatCommentTime = (timestamp) => {
  const commentDate = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - commentDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  return commentDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
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
            response.data.post.favorites?.some(
              (fav) => fav.userId === userId
            ) || false
          );
        }
      } catch (err) {
        toast.error("Failed to fetch blog post", {
          duration: 4000,
          position: "top-center",
          style: { background: "#fee2e2", color: "#dc2626" },
        });
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to like this post!", {
        duration: 3000,
        position: "top-center",
      });
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
      toast.success(isLiked ? "Like removed!" : "Liked!", {
        duration: 2000,
        position: "top-center",
        style: { background: "#dcfce7", color: "#166534" },
      });
    } catch (err) {
      toast.error("Failed to toggle like", {
        duration: 3000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    }
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to favorite this post!", {
        duration: 3000,
        position: "top-center",
      });
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
      toast.success(
        isFavorited ? "Removed from favorites!" : "Added to favorites!",
        {
          duration: 2000,
          position: "top-center",
          style: { background: "#dcfce7", color: "#166534" },
        }
      );

      if (response.data.favorites) {
        setPost((prevPost) => ({
          ...prevPost,
          favorites: response.data.favorites,
        }));
      }
    } catch (err) {
      toast.error("Failed to toggle favorite", {
        duration: 3000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to comment!", {
        duration: 3000,
        position: "top-center",
      });
      navigate("/login");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/v1/api/comments/",
        { postId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = JSON.parse(atob(token.split(".")[1]));
      const newCommentData = {
        id: response.data.id || Date.now().toString(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: { id: userData.id, name: userData.name, email: userData.email },
      };

      setPost((prevPost) => ({
        ...prevPost,
        comments: [newCommentData, ...prevPost.comments],
      }));
      setNewComment("");
      toast.success("Comment posted!", {
        duration: 2000,
        position: "top-center",
        style: { background: "#dcfce7", color: "#166534" },
      });
    } catch (err) {
      toast.error("Failed to post comment", {
        duration: 3000,
        position: "top-center",
        style: { background: "#fee2e2", color: "#dc2626" },
      });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <Loader size="large" />
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 bg-gradient-to-br from-rose-50 via-white to-pink-50">
        Post not found
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-rose-100 via-white to-pink-150">
      {/* <div className="absolute z-10 bg-pink-500 rounded-bl-full opacity-50 right-50 top-50 w-10/2 h-1/2"></div> */}
      <Header />
      <Toaster />
      {/* Background Shapes */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/2 bg-pink-300 rounded-bl-full h-1/2 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/3 rounded-tr-full h-1/3 bg-rose-100 opacity-20"></div>
        <div className="absolute w-40 h-40 rounded-full opacity-25 top-1/3 left-1/4 bg-rose-50 blur-2xl"></div>
        <div className="absolute w-48 h-48 bg-pink-100 rounded-full opacity-25 bottom-1/4 right-1/3 blur-2xl"></div>
        <div className="absolute w-32 h-32 rounded-full top-10 left-10 bg-rose-200 opacity-15 blur-xl"></div>
        <div className="absolute w-56 h-56 rounded-tl-full bottom-1/2 right-20 bg-pink-50 opacity-20 blur-2xl"></div>
      </div> */}
    
      <motion.section
        className="relative z-10 max-w-4xl px-4 py-12 mx-auto mt-12 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="p-6 bg-white border shadow-xl sm:p-8 rounded-2xl border-rose-100"
          variants={itemVariants}
        >
          <motion.img
            src={
              post.featuredImg ||
              "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={post.title}
            className="object-cover w-full h-48 mb-6 rounded-lg sm:h-64"
            variants={itemVariants}
            transition={{ type: "spring", stiffness: 300 }}
          />

          <motion.h1
            className="mb-6 text-2xl font-extrabold text-center text-transparent text-gray-800 sm:text-3xl lg:text-4xl bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text"
            variants={itemVariants}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="flex flex-col items-center justify-between gap-4 mb-6 text-gray-600 sm:flex-row sm:mb-8 sm:gap-0"
            variants={itemVariants}
          >
            <p className="text-base sm:text-lg">
              By{" "}
              <span className="font-semibold text-rose-500">
                {post.author?.name || "Unknown Author"}
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs sm:justify-end sm:gap-4 sm:text-sm">
              <span className="px-2 py-1 rounded-full bg-rose-50 sm:px-3">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 rounded-full bg-rose-50 sm:px-3">
                {post.readingTime ? `${post.readingTime} min read` : "N/A"}
              </span>
              <span className="px-2 py-1 rounded-full bg-rose-50 sm:px-3">
                {post.views} views
              </span>
              <span className="px-2 py-1 rounded-full bg-rose-50 sm:px-3">
                {post.likes.length} likes
              </span>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center gap-4 mb-6 sm:gap-6 sm:mb-8"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleLikeToggle}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </motion.button>
            <motion.button
              onClick={handleFavoriteToggle}
              className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                isFavorited
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFavorited ? <FaStar size={20} /> : <FaRegStar size={20} />}
            </motion.button>
          </motion.div>

          <motion.div
            className="pl-4 mb-8 prose-sm prose text-gray-700 border-l-4 sm:prose-lg max-w-none sm:mb-10 border-rose-500"
            variants={itemVariants}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <motion.div variants={itemVariants}>
            <h2 className="mb-6 text-xl font-semibold text-gray-800 sm:text-2xl">
              Comments ({post.comments.length})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mb-8">
              <motion.textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 text-sm text-gray-800 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-base"
                rows="4"
                whileFocus={{ scale: 1.01, borderColor: "#f43f5e" }}
              />
              <motion.button
                type="submit"
                className="px-6 py-2 mt-4 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Post Comment
              </motion.button>
            </form>

            {post.comments.length > 0 ? (
              [...post.comments]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="flex gap-4 p-4 mb-4 rounded-lg shadow-sm bg-gray-50"
                    variants={commentVariants}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold text-white rounded-full bg-rose-500">
                      {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </motion.div>
                ))
            ) : (
              <p className="py-8 text-sm text-center text-gray-600 sm:text-base">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-between gap-4 mt-8 text-sm text-gray-500 sm:flex-row sm:gap-0"
            variants={itemVariants}
          >
            <p>
              Status:{" "}
              <span
                className={
                  post.status === "Published"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {post.status}
              </span>
            </p>
            <Link
              to="/blog"
              className="font-semibold px-8 py-2 rounded-full transition bg-red-500 hover:bg-rose-500 text-white"
            >
              Back
            </Link>
            {/* <button className="bg-red-500 rounded-full px-8 py-2 text-white"><Link to="/login">Back</Link></button> */}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default BlogPage;
