import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogCards = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://blogify-backend-sxn5.onrender.com/v1/api/posts');
        // Filter for published posts only (optional, remove if you want all posts)
        const publishedPosts = response.data.filter(post => post.status === 'published');
        setPosts(publishedPosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog posts');
        setLoading(false);
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Use featuredImg if available, otherwise use a placeholder */}
          <img
            src={post.featuredImg || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={post.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {post.title}
            </h3>
            <p className="text-gray-600 text-sm">Author : {post.author.name}</p>
            <div className="flex items-center mt-2">
              {/* Rating isn't available in API, adding placeholder stars */}
              {/* <span className="text-gray-600">{post.likes.userId}</span> */}
              <span className="ml-2 text-gray-600 text-sm">
                {post.readingTime ? `${post.readingTime} min read` : 'N/A'}
              </span>
            </div>
            {/* Optional: Add views count */}
            <p className="text-gray-500 text-sm mt-1">{post.views} views</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BlogCards;