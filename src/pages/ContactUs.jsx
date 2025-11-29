import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const ContactUs = () => {

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
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pink-200 rounded-bl-full opacity-40"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800"
            variants={itemVariants}
          >
            Get in Touch
            <br />
            <span className="text-rose-500">We’d Love to Hear From You</span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-lg text-gray-600 sm:text-lg"
            variants={itemVariants}
          >
            Whether you have a question, feedback, or just want to say hello —
            we’re always happy to connect.
          </motion.p>
        </div>
      </motion.section>

      {/* Form + Info Section */}
      <motion.section
        className="px-6 pb-20 sm:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <motion.div
            className="bg-white shadow-lg rounded-xl p-6 sm:p-8 border border-rose-100"
            variants={itemVariants}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
              Send us a message
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Write your message..."
                  className="mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 w-full sm:w-auto text-white font-medium rounded-full 
                bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 transition-all"
              >
                Send Message
                <FaPaperPlane className="ml-2" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="flex items-start space-x-4 bg-white p-5 rounded-lg shadow border border-rose-100">
              <FaEnvelope className="text-rose-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-800">Email</p>
                <p className="text-sm text-gray-600">vishalkgupta34@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white p-5 rounded-lg shadow border border-rose-100">
              <FaPhoneAlt className="text-rose-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-800">Phone</p>
                <p className="text-sm text-gray-600">+91 8882804354</p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>
    </div>
  );
};

export default ContactUs;
