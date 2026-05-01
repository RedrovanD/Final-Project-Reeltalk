import { Link, Route, Routes } from 'react-router-dom';
import { Fish, PlusCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import Home from './pages/Home.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostDetail from './pages/PostDetail.jsx';
import EditPost from './pages/EditPost.jsx';
import FishFinder from "./pages/FishFinder.jsx";

export default function App() {

  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "default";
});

  const themeLabel = {
    default: "🌊",
    sunset: "🌅",
    night: "🌙"
  };

  useEffect(() => {
  if (theme === "default") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", theme);
  }

  // ⭐ Save to localStorage
  localStorage.setItem("theme", theme);

}, [theme]);

  function cycleTheme() {
    if (theme === "default") setTheme("sunset");
    else if (theme === "sunset") setTheme("night");
    else setTheme("default");
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <Link className="brand" to="/">
          <Fish size={30} />
          <span>ReelTalk</span>
        </Link>

        <div className="nav-actions">
          <button onClick={cycleTheme} className="nav-button secondary">
            Theme {themeLabel[theme]}
          </button>

          <Link className="nav-button" to="/fish-finder">
            Fish Finder
          </Link>

          <Link className="nav-button" to="/create">
            <PlusCircle size={18} /> New Cast
          </Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />
          <Route path="/fish-finder" element={<FishFinder />} />
        </Routes>
      </main>
    </div>
  );
}
