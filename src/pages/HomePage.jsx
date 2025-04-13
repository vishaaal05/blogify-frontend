import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { FaArrowRight, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://blogify-backend-sxn5.onrender.com/v1/api/posts"
        );
        // Check if response.data exists and has posts
        if (response.data && Array.isArray(response.data)) {
          setFeaturedPosts(response.data.slice(0, 3));
        } else if (response.data && Array.isArray(response.data.data)) {
          setFeaturedPosts(response.data.data.slice(0, 3));
        } else {
          console.error("Unexpected API response format:", response.data);
          setFeaturedPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setFeaturedPosts([]);
      }
    };

    fetchPosts();
  }, []);

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

  const bubbleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 10 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-r from-pink-100 to-white">
      <Header />
      {/* Background Shapes */}

      {/* <div className="absolute z-100"> */}
      {/* Original Shapes */}
      {/* <div className="absolute z-10 bg-pink-500 rounded-bl-full opacity-50 right-50 top-50 w-10/2 h-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 rounded-tr-full h-1/3 bg-rose-100 opacity-20"></div>
      <div className="absolute w-40 h-40 rounded-full opacity-25 top-1/3 left-1/4 bg-rose-50 blur-2xl"></div>
      <div className="absolute w-48 h-48 bg-pink-100 rounded-full opacity-25 bottom-1/4 right-1/3 blur-2xl"></div> */}
      {/* Additional Shapes */}
      {/* <div className="absolute w-32 h-32 rounded-full top-10 left-10 bg-rose-200 opacity-15 blur-xl"></div>
      <div className="absolute w-56 h-56 rounded-tl-full bottom-1/2 right-20 bg-pink-50 opacity-20 blur-2xl"></div>
      <div className="absolute rounded-br-full top-2/3 left-1/2 w-36 h-36 bg-rose-100 opacity-15 blur-xl"></div>
      <div className="absolute w-24 h-24 bg-pink-200 rounded-full bottom-10 right-1/4 opacity-10 blur-xl"></div> */}
      {/* </div> */}

      {/* Hero Section */}
      <motion.section
        className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center min-h-[80vh]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50"></div>
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-16">
            <motion.div className="space-y-6 md:w-1/2" variants={itemVariants}>
              <h1 className="text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl">
                Discover Stories & Ideas
                <br />
                <span className="text-rose-500">Your Blog Adventure</span>
              </h1>
              <p className="max-w-md text-base text-gray-600 sm:text-lg">
                Dive into a vibrant community of writers sharing insights,
                experiences, and inspiration.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
              >
                Start Reading <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>

            <motion.div className="md:w-1/2" variants={itemVariants}>
              <img
                src="/writing.png"
                alt="Blog Illustration"
                className="max-w-sm mx-auto "
              />
            </motion.div>
          </div>

          <motion.div
            className="absolute items-center hidden max-w-xs p-4 space-x-4 bg-white border rounded-lg shadow-lg sm:flex bottom-10 right-4 lg:right-10 border-rose-100"
            variants={bubbleVariants}
          >
            <img
              src="https://avatar.iran.liara.run/public/girl"
              alt="User Avatar"
              className="flex-shrink-0 w-10 h-10 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                Jane Johnson
              </p>
              <p className="text-xs text-gray-600">Join the blog journey!</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Posts Section */}
      <motion.section
        className="px-4 py-16 mx-auto sm:px-6 lg:px-8 max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2
          className="mb-12 text-2xl font-bold text-center text-gray-800 sm:text-3xl"
          variants={itemVariants}
        >
          Featured Posts
        </motion.h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <motion.div
              key={post.id}
              className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
              variants={itemVariants}
            >
              <Link to={`/blog/${post.id}`}>
                <img
                  src={
                    post.featuredImg || "https://via.placeholder.com/300x200"
                  }
                  alt={post.title}
                  className="object-cover w-full h-40 rounded-t-lg sm:h-48"
                />
                <div className="p-4 sm:p-5">
                  <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      By <b>{post.author?.name || "Anonymous"}</b>
                    </span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Categories Section */}
      {/* <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.h2
          className="mb-12 text-2xl font-bold text-center text-gray-800 sm:text-3xl"
          variants={itemVariants}
        >
          Explore Categories
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {categories.map((category) => (
            <motion.div
              key={category}
              className="px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full sm:px-6 bg-rose-50 text-rose-600 hover:bg-rose-100 sm:text-base"
              variants={itemVariants}
            >
              {category}
            </motion.div>
          ))}
        </div>
      </motion.section> */}

      {/* Share Your Thoughts Section */}
      <motion.section
        className="flex flex-col items-center gap-14 px-6 sm:px-10 lg:px-20 py-16 mx-auto max-w-7xl md:flex-row lg:gap-24 justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div
          className="order-2 md:w-1/2 md:order-1"
          variants={itemVariants}
        >
          <img
            src="/blog.png"
            alt="Blog"
            className="max-w-xs w-64 sm:max-w-sm md:max-w-md lg:max-w-md"
          />
        </motion.div>
        <motion.div
          className="space-y-6 md:w-1/2 order-1 md:order-2"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
            Share Your Voice
          </h2>
          <p className="max-w-md text-base text-gray-600 sm:text-lg">
            Have a story or idea? Join our community and start writing today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 mt-4 font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
          >
            Get Started <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </motion.section>

      {/* Newsletter Signup Section */}
      <motion.section
        className="px-4 py-16 sm:px-6 lg:px-8 bg-rose-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div
          className="max-w-xl mx-auto space-y-6 text-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Stay Updated
          </h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Subscribe to our newsletter for the latest posts and updates.
          </p>
          <form className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 sm:text-base"
            />
            <button
              type="submit"
              className="flex items-center justify-center px-6 py-3 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
            >
              Subscribe <FaEnvelope className="ml-2" />
            </button>
          </form>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;
