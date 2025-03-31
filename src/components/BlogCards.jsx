import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://blogify-backend-sxn5.onrender.com/v1/api/posts"
        );
        const publishedPosts = response.data.filter(
          (post) => post.status === "published"
        );
        setPosts(publishedPosts); // Show all posts (or filter as needed)
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog posts");
        setLoading(false);
        console.error("Error fetching posts:", err);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          Our Blogs
        </h1> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id}>
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={
                    post.featuredImg ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Author: {post.author.name}
                  </p>
                  <div className="flex items-center mt-2">
                    {/* <span className="text-yellow-500">★★★★☆</span> */}
                    <span className="text-yellow-500">{post.likes.userId}</span>
                    <span className="ml-2 text-gray-600 text-sm">
                      {post.readingTime
                        ? `${post.readingTime} min read`
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {post.views} views
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogsPage;
