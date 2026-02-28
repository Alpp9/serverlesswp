import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function SearchResults() {
  const { query } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPosts([]);

    // Attempt to fetch from WP REST API relative path with search query
    fetch(`/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch search results.');
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
  }, [query]);

  return (
    <div className="search-results-page">
      <div className="back-link-container">
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      </div>
      <h2 className="search-title">Search Results for: "{query}"</h2>

      {loading && <p className="status-message">Loading search results...</p>}

      {error && (
        <div className="status-message error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="status-message">No posts found matching your search.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-container">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Link>
              <div className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <Link to={`/post/${post.id}`} className="read-more">Read More &rarr;</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
