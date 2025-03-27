import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://blogify-backend-sxn5.onrender.com/v1/api/posts/${id}`);
        setPost(response.data.post);
        setLoading(false);

        // Check if user has liked the post
        const token = localStorage.getItem('token');
        if (token) {
          const userId = JSON.parse(atob(token.split('.')[1])).id;
          setIsLiked(response.data.post.likes.some((like) => like.userId === userId));
        }
      } catch (err) {
        setError('Failed to fetch blog post');
        setLoading(false);
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleLikeToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in to like this post.');
      navigate('/login');
      return;
    }

    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Get user ID from token
      const response = await axios.post(
        'https://blogify-backend-sxn5.onrender.com/v1/api/likes/toggle',
        { postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistically update the likes count and state
      setPost((prevPost) => {
        const newLikes = isLiked
          ? prevPost.likes.filter((like) => like.userId !== userId) // Remove like
          : [...prevPost.likes, { id: `${userId}-${id}`, userId, postId: id, createdAt: new Date() }]; // Add like
        return { ...prevPost, likes: newLikes };
      });
      setIsLiked(!isLiked);

      // If API returns updated likes, use that instead
      if (response.data.likes) {
        setPost((prevPost) => ({ ...prevPost, likes: response.data.likes }));
      }
    } catch (err) {
      console.error('Error toggling like:', err.response?.data || err.message);
      alert('Failed to toggle like.');
      // Revert state on error (optional)
      setIsLiked(isLiked); // Keep old state
    }
  };

  const handleFavoriteToggle = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in to favorite this post.');
      navigate('/login');
      return;
    }

    setIsFavorited(!isFavorited);
    alert(isFavorited ? 'Removed from favorites!' : 'Added to favorites!');
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-8 text-gray-600">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
          <motion.img
            src={post.featuredImg || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={post.title}
            className="w-full h-80 object-cover rounded-lg mb-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-center"
            variants={itemVariants}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-between text-gray-600 mb-8"
            variants={itemVariants}
          >
            <p className="text-lg">
              By <span className="font-semibold text-red-500">{post.author?.name || 'Unknown Author'}</span>
            </p>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0 text-sm">
              <span className="bg-gray-100 px-2 py-1 rounded">{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {post.readingTime ? `${post.readingTime} min read` : 'N/A'}
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">{post.views} views</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{post.likes.length} likes</span>
            </div>
          </motion.div>

          {/* Like and Favorite Buttons */}
          <motion.div className="flex gap-4 mb-6" variants={itemVariants}>
            <button
              onClick={handleLikeToggle}
              className={`px-4 py-2 rounded-lg transition ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-red-600 hover:text-white`}
            >
              {isLiked ? 'Unlike' : 'Like'} 
              {/* ({post.likes.length}) */}
            </button>
            <button
              onClick={handleFavoriteToggle}
              className={`px-4 py-2 rounded-lg transition ${isFavorited ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-yellow-600 hover:text-white`}
            >
              {isFavorited ? 'Unfavorite' : 'Favorite'}
            </button>
          </motion.div>

          <motion.div
            className="prose prose-lg text-gray-700 mb-10 border-l-4 border-red-500 pl-4"
            variants={itemVariants}
          >
            <p>{post.content}</p>
          </motion.div>

          {post.comments.length > 0 && (
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Comments ({post.comments.length})
              </h2>
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex flex-col"
                  variants={commentVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <p className="text-gray-700">{comment.content}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Posted on {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="flex justify-between items-center text-sm text-gray-500 mt-8"
            variants={itemVariants}
          >
            <p>
              Status: <span className={post.status === 'published' ? 'text-green-500' : 'text-yellow-500'}>{post.status}</span>
            </p>
            <Link to="/blogs" className="text-red-500 hover:underline font-semibold">
              Back to Blogs
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default BlogPage;