import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import BlogCards from "../components/BlogCards";
import Loader from "../components/Loader";
import { motion } from "framer-motion";

const BlogsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get("https://blogify-backend-sxn5.onrender.com/v1/api/posts"),
          axios.get("https://blogify-backend-sxn5.onrender.com/v1/api/categories")
        ]);

        const publishedPosts = postsResponse.data.filter(
          (post) => post.status === "published"
        );
        setPosts(publishedPosts);
        
        const categoriesData = Array.isArray(categoriesResponse.data.categories) 
          ? categoriesResponse.data.categories 
          : Array.isArray(categoriesResponse.data) 
            ? categoriesResponse.data 
            : [];
            
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => 
        post.categories.some(cat => cat.categoryId === selectedCategory)
      );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-10">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <Loader size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 px-4"
            >
              {/* <h2 className="text-2xl font-bold text-gray-800 mb-4">Categories</h2> */}
              <div className="flex flex-wrap gap-3 my-10 justify-center items-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === "all"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </motion.div>
            <BlogCards 
              posts={filteredPosts} 
              categories={categories}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
