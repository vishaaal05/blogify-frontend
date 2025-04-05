import React from "react";
import { Header } from "../components/Header";
import BlogCards from "../components/BlogCards";

const BlogsPage = () => {
  return <div>
    <Header/>
    <div className="py-10">
    <BlogCards/>
    </div>
  
  </div>;
};

export default BlogsPage;
