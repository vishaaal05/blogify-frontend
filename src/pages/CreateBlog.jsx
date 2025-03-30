import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Editor } from 'primereact/editor'; // Import PrimeReact Editor
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Theme
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons

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

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Content now stores HTML from Editor
  const [featuredImg, setFeaturedImg] = useState('');
  const [status, setStatus] = useState('draft'); // Default to draft
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a blog post.');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);

    const decoded = jwtDecode(token);
    const authorId = decoded.id;
    try {
      const response = await axios.post(
        'https://blogify-backend-sxn5.onrender.com/v1/api/posts/create',
        {
          title,
          content, // Send HTML content from Editor
          authorId,
          featuredImg: featuredImg || null,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Blog Created:', response.data);
      alert('Blog post created successfully!');
      navigate('/author/dashboard');
    } catch (err) {
      console.error('Error creating blog:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create blog post.');
    } finally {
      setLoading(false);
    }
  };

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
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center"
            variants={itemVariants}
          >
            Create a New Blog Post
          </motion.h1>

          {error && (
            <motion.div
              className="bg-red-100 text-red-700 p-4 rounded-lg mb-6"
              variants={itemVariants}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <motion.div variants={itemVariants}>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-800 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your blog title"
                required
              />
            </motion.div>

            {/* Content (PrimeReact Editor) */}
            <motion.div variants={itemVariants}>
              <label htmlFor="content" className="block text-lg font-semibold text-gray-800 mb-2">
                Content
              </label>
              <Editor
                value={content}
                onTextChange={(e) => setContent(e.htmlValue || '')} // Store HTML content
                style={{ height: '320px' }}
                className="w-full border border-gray-300 rounded-lg"
                placeholder="Write your blog content here..."
              />
            </motion.div>

            {/* Featured Image */}
            <motion.div variants={itemVariants}>
              <label htmlFor="featuredImg" className="block text-lg font-semibold text-gray-800 mb-2">
                Featured Image URL (Optional)
              </label>
              <input
                type="url"
                id="featuredImg"
                value={featuredImg}
                onChange={(e) => setFeaturedImg(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </motion.div>

            {/* Status */}
            <motion.div variants={itemVariants}>
              <label htmlFor="status" className="block text-lg font-semibold text-gray-800 mb-2">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white transition ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Creating...' : 'Create Blog Post'}
              </button>
            </motion.div>
          </form>

          {/* Back to Dashboard */}
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <Link
              to="/author/dashboard"
              className="text-red-500 hover:underline font-semibold"
            >
              Back to Author Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default CreateBlog;