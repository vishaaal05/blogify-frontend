import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Editor } from "primereact/editor";
import toast, { Toaster } from "react-hot-toast";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const UpdateBlog = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // Get postId from URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImg, setFeaturedImg] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchPost();
  }, [postId, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://blogify-backend-sxn5.onrender.com/v1/api/categories"
      );
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchPost = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to edit a blog post.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://blogify-backend-sxn5.onrender.com/v1/api/posts/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const post = response.data.post; // Assuming { success: true, post: {...} }
      setTitle(post.title);
      setContent(post.content);
      setFeaturedImg(post.featuredImg || "");
      setStatus(post.status);
      if (post.category) {
        setSelectedCategory(post.category.id);
        setCurrentCategoryId(post.category.id);
      }
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching post:",
        err.response?.data || err.message
      );
      setError(
        "Failed to load blog post. It may not exist or you lack permission."
      );
      setLoading(false);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://blogify-backend-sxn5.onrender.com/api/v1/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.imageUrl) {
        setFeaturedImg(response.data.imageUrl);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to get image URL from server");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error(err.response?.data?.message || "Failed to upload image");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      uploadImageToCloudinary(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update a blog post.");
      navigate("/login");
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      // First update the post
      const updateResponse = await axios.put(
        `https://blogify-backend-sxn5.onrender.com/v1/api/posts/${postId}`,
        {
          title,
          content,
          featuredImg: featuredImg || null,
          status,
          categoryId: selectedCategory, // Include categoryId in the main update
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show success message
      toast.success("Blog post updated successfully!");

      // Navigate to the updated blog post page instead of dashboard
      navigate(`/blog/${postId}`);
    } catch (err) {
      console.error("Error updating blog:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.message || "Failed to update blog post.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-8 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" />
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
            Update Blog Post
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
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
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

            {/* Category */}
            <motion.div variants={itemVariants}>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="content"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Content
              </label>
              <Editor
                value={content}
                onTextChange={(e) => setContent(e.htmlValue || "")} // Store HTML content
                style={{ height: "320px" }}
                className="w-full border border-gray-300 rounded-lg"
                placeholder="Write your blog content here..."
              />
            </motion.div>

            {/* Featured Image */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="featuredImg"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Thumbnail Image
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  id="featuredImg"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {uploading && (
                  <div className="text-blue-500">Uploading image...</div>
                )}
                {(imagePreview || featuredImg) && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || featuredImg}
                      alt="Preview"
                      className="max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
                {featuredImg && (
                  <div className="text-sm text-green-600">
                    Image uploaded successfully! ✓
                  </div>
                )}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="status"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
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
                disabled={submitLoading}
                className={`w-full py-3 rounded-lg text-white transition ${
                  submitLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {submitLoading ? "Updating..." : "Update Blog Post"}
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

export default UpdateBlog;
