import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function Category() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPosts([]);

    // Fetch the category name
    fetch(`/wp-json/wp/v2/categories/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
          if (data && data.name) setCategoryName(data.name);
      })
      .catch(err => console.error("Error fetching category:", err));

    // Fetch posts for this category
    fetch(`/wp-json/wp/v2/posts?categories=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch posts for this category.');
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
      <h2 className="search-title">Category: {categoryName || id}</h2>

      {loading && <p className="status-message">Loading category posts...</p>}

      {error && (
        <div className="status-message error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="status-message">No posts found in this category.</p>
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

export default Category;
