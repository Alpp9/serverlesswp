import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt to fetch from WP REST API relative path
    fetch('/wp-json/wp/v2/posts')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch posts (perhaps the DB is not setup or there are no posts).');
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>WordPress React Dashboard</h1>
        {loading && <p>Loading posts from WordPress backend...</p>}
        {error && (
          <div>
            <p>Error: {error}</p>
            <p>Make sure you have deployed this project to Vercel and configured the database environment variables as per the ServerlessWP instructions.</p>
          </div>
        )}
        {!loading && !error && posts.length === 0 && (
          <p>No posts found on the backend.</p>
        )}
        {!loading && !error && posts.length > 0 && (
          <div className="posts-container">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              </article>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
