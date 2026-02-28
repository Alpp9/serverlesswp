import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import SearchResults from './pages/SearchResults';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="nav-bar">
          <div className="nav-container">
            <Link to="/" className="site-title">
              WordPress React Dashboard
            </Link>
            <div className="nav-actions">
              <SearchBar />
            </div>
          </div>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/search/:query" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
