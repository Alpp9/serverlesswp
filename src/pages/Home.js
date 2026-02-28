import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    // Attempt to fetch from WP REST API relative path with pagination
    fetch(`/wp-json/wp/v2/posts?page=${page}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch posts (perhaps the DB is not setup or there are no posts).');
        }
        const total = res.headers.get('X-WP-TotalPages');
        if (total) {
            setTotalPages(parseInt(total, 10));
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
  }, [page]);

  if (loading) return <p className="status-message">Loading posts from WordPress backend...</p>;

  if (error) {
    return (
      <div className="status-message error-message">
        <p>Error: {error}</p>
        <p>Make sure you have deployed this project to Vercel and configured the database environment variables as per the ServerlessWP instructions.</p>
      </div>
    );
  }

  if (posts.length === 0) return <p className="status-message">No posts found on the backend.</p>;

  return (
    <div className="home-page">
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

      <div className="pagination-container">
        <button
            className="btn-primary"
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
        >
            &larr; Previous
        </button>
        <span className="page-indicator">Page {page} of {totalPages}</span>
        <button
            className="btn-primary"
            disabled={page === totalPages || totalPages === 1}
            onClick={() => setPage(prev => prev + 1)}
        >
            Next &rarr;
        </button>
      </div>
    </div>
  );
}

export default Home;
