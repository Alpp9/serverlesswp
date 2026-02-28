import { ThemeProvider } from "./ThemeContext";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import SearchResults from './pages/SearchResults';
import Category from './pages/Category';
import SinglePage from './pages/SinglePage';
import Tag from './pages/Tag';
import Author from './pages/Author';
import NotFound from './pages/NotFound';
import SearchBar from './components/SearchBar';
import CategoriesNav from './components/CategoriesNav';
import PagesNav from './components/PagesNav';
import { ThemeContext } from './ThemeContext';
import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Router>
      <div className={`App ${theme}-mode`}>
        <header className="nav-bar">
          <div className="nav-container">
            <Link to="/" className="site-title">
              WordPress React Dashboard
            </Link>

            <div className="nav-links">
                <CategoriesNav />
                <PagesNav />
            </div>

            <div className="nav-actions">
              <SearchBar />
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/tag/:id" element={<Tag />} />
            <Route path="/author/:id" element={<Author />} />
            <Route path="/page/:id" element={<SinglePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
