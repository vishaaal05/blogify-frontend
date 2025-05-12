import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlogCards = ({ posts, categories }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <p className="text-xl text-gray-600">No posts found in this category</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl flex flex-col h-[500px]"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <div className="relative h-48">
                    <img
                      src={
                        post.featuredImg ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {post.categories.map((cat) => (
                        <span
                          key={cat.categoryId}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs"
                        >
                          {getCategoryName(cat.categoryId)}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    <p
                      className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt || post.content?.substring(0, 500) + "...",
                      }}
                    ></p>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            post.author?.avatar ||
                            "https://avatar.iran.liara.run/public/boy"
                          }
                          alt={post.author?.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {post.author?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="text-rose-500">♥ {post.likes?.length || 0}</span>
                        <span>👁 {post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BlogCards;
