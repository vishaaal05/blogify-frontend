import React from 'react'
import { blogPosts } from '../Constants'
import { motion } from 'framer-motion';
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

const BlogCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {blogPosts.map((post) => (
      <motion.div
        key={post.id}
        className="bg-white rounded-lg shadow-md overflow-hidden"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm">{post.author}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="ml-2 text-gray-600 text-sm">
              {post.rating}
            </span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
  )
}

export default BlogCards