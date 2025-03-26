import { motion } from "framer-motion";
// import { blogPosts } from "../Constants";
import BlogCards from "../components/BlogCards";
import Button from "../components/Button";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";

const HomePage = () => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <motion.section
        className="relative  py-20 px-6 bg-gradient-to-r from-pink-100 to-white flex flex-col md:flex-row items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Background Decorative Shape */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-50"></div>

        {/* Left Content */}
        <motion.div className="md:w-1/2 space-y-6 z-10" variants={itemVariants}>
          <h1 className="text-5xl font-bold text-gray-800">
            Human stories & ideas
            <br />A Blog Journey
          </h1>
          <p className="text-gray-600">
            A place to read, write, and deepen your understanding
          </p>
          {/* <button className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition">Start Reading</button> */}
          <p>
          <Link to="/blogs" className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition">Start Reading</Link>
          </p>
          
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 z-10"
          variants={itemVariants}
        >
          <img
            src=""
            alt="Food Plate"
            className="rounded-lg shadow-lg size-24"
          />
        </motion.div>

        {/* Floating Chat Bubble */}
        <motion.div
          className="absolute bottom-10 right-10 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
        >
          <img
            src="https://via.placeholder.com/40x40.png?text=User"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">Jane Johnson</p>
            <p className="text-gray-600 text-sm">Ready to explore blogs?</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Share Your Thoughts Section */}
      <motion.section
        className="py-16 px-6 flex flex-col md:flex-row items-center space-y-10 md:space-y-0 md:space-x-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div className="md:w-1/2" variants={itemVariants}>
          <img
            src="https://via.placeholder.com/400x300.png?text=Phone+Food"
            alt="Phone with Food"
            className="rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.div className="md:w-1/2 space-y-6" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-800">
            Share your thoughts
          </h2>
          <p className="text-gray-600">
            Got an idea? Share it with the world! Your words can inspire,
            educate, and spark conversations.
          </p>
          <p>
            <Link
              to="/signup"
              className="px-6 py-3 mt-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              {" "}
              Write a Blog{" "}
            </Link>
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HomePage;
