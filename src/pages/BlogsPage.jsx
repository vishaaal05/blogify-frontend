import React from "react";
import { Header } from "../components/Header";
import BlogCards from "../components/BlogCards";

const BlogsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-10">
        <BlogCards />
      </div>
    </div>
  );
};

export default BlogsPage;
