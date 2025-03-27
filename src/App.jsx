import "./App.css";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthorDashboardPage from "./pages/AuthorDashboardPage";
import BlogsPage from "./pages/BlogsPage";
import BlogPage from "./pages/BlogPage";
import UserDashboard from "./pages/UserDashboardPage";
import CreateBlog from "./pages/CreateBlog";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/author/dashboard" element={<AuthorDashboardPage />} />
          <Route path="/blogs" element={<BlogsPage />}></Route>
          <Route path="/create/post" element={<CreateBlog/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
