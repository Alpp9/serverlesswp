import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
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
          </div>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<SinglePost />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
