import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";



//Importing files
import "./App.css"
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";



const App = () =>{
  return(
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/jobs" element={<Jobs />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/post/application/:jobId" element={<PostApplication />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<NotFound />}/>
      </Routes>
      <Footer />
    </Router>

    </>
  )
};


export default App;