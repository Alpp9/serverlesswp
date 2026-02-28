import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Helmet } from "react-helmet-async";

function Author() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPosts([]);

    // Fetch the author details
    fetch(`/wp-json/wp/v2/users/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
          if (data && data.name) setAuthorName(data.name);
      })
      .catch(err => console.error("Error fetching author details:", err));

    // Fetch posts for this author
    fetch(`/wp-json/wp/v2/posts?author=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch posts for this author.');
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
      <Helmet>
        <title>{`Author: ${authorName || id}`} - WordPress React Dashboard</title>
        <meta name="description" content={`Posts by ${authorName || id}`} />
      </Helmet>
      <div className="back-link-container">
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      </div>
      <h2 className="search-title">Author: {authorName || id}</h2>

      {loading && <p className="status-message">Loading author's posts...</p>}

      {error && (
        <div className="status-message error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="status-message">No posts found for this author.</p>
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

export default Author;
