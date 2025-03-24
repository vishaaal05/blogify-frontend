import './App.css'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
function App() {


  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
