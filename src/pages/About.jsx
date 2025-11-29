import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { FaUsers, FaPenNib, FaBookOpen, FaHeart } from "react-icons/fa";

const AboutUs = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-r from-pink-100 to-white">
      <Header />

      {/* Hero Section */}
      <motion.section
        className="relative pt-28 pb-16 px-6 sm:px-10 lg:px-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-rose-200 rounded-br-full opacity-40"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800"
            variants={itemVariants}
          >
            About Blogify
            <br />
            <span className="text-rose-500">Where Words Come Alive</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-lg text-gray-600 sm:text-lg"
            variants={itemVariants}
          >
            Blogify is a modern blogging platform where writers express their thoughts 
            and readers explore stories, knowledge, and inspiration from around the world.
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="px-6 py-16 sm:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

          <motion.div className="bg-white p-6 rounded-lg shadow border border-rose-100" variants={itemVariants}>
            <FaUsers className="text-rose-500 text-2xl mb-3" />
            <h3 className="font-semibold text-gray-800">Author Community</h3>
            <p className="text-sm text-gray-600 mt-2">
              Anyone can register as an author and share their voice with the world.
            </p>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-lg shadow border border-rose-100" variants={itemVariants}>
            <FaPenNib className="text-rose-500 text-2xl mb-3" />
            <h3 className="font-semibold text-gray-800">Write Stories</h3>
            <p className="text-sm text-gray-600 mt-2">
              Write blogs easily using our rich editor and publish instantly.
            </p>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-lg shadow border border-rose-100" variants={itemVariants}>
            <FaBookOpen className="text-rose-500 text-2xl mb-3" />
            <h3 className="font-semibold text-gray-800">Read Anywhere</h3>
            <p className="text-sm text-gray-600 mt-2">
              Read blogs from any device with a smooth and distraction-free experience.
            </p>
          </motion.div>

          <motion.div className="bg-white p-6 rounded-lg shadow border border-rose-100" variants={itemVariants}>
            <FaHeart className="text-rose-500 text-2xl mb-3" />
            <h3 className="font-semibold text-gray-800">Built with Love</h3>
            <p className="text-sm text-gray-600 mt-2">
              Designed for creators and readers who love meaningful content.
            </p>
          </motion.div>

        </div>
      </motion.section>

      {/* Our Story Section */}
      <motion.section
        className="px-6 pb-20 sm:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <motion.img
            src="/writing.png"
            alt="About illustration"
            className="max-w-sm mx-auto"
            variants={itemVariants}
          />

          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 mb-4">
              Our goal is to give everyone a platform where they can express ideas, 
              experiences, and creativity freely.
            </p>
            <p className="text-gray-600">
              Whether you are a beginner or a professional writer, Blogify helps you 
              grow your audience, improve your skills, and share your voice without limits.
            </p>
          </motion.div>

        </div>
      </motion.section>

    </div>
  );
};

export default AboutUs;
