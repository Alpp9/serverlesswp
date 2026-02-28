import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Tag() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPosts([]);

    // Fetch the tag name
    fetch(`/wp-json/wp/v2/tags/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
          if (data && data.name) setTagName(data.name);
      })
      .catch(err => console.error("Error fetching tag:", err));

    // Fetch posts for this tag
    fetch(`/wp-json/wp/v2/posts?tags=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch posts for this tag.');
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
  }, [id]);

  return (
    <div className="search-results-page">
      <div className="back-link-container">
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      </div>
      <h2 className="search-title">Posts Tagged: {tagName || id}</h2>

      {loading && <p className="status-message">Loading tag posts...</p>}

      {error && (
        <div className="status-message error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="status-message">No posts found for this tag.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="posts-container">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </Link>
              <div className="post-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              <div className="post-meta"><span>By <Link to={`/author/${post.author}`} className="author-link">Author {post.author}</Link></span><Link to={`/post/${post.id}`} className="read-more">Read More &rarr;</Link></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tag;
