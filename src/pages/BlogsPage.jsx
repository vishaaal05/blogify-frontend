import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import BlogCards from "../components/BlogCards";
import Loader from "../components/Loader";

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
        setPosts(publishedPosts);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blog posts");
        setLoading(false);
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

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
          <BlogCards posts={posts} />
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
