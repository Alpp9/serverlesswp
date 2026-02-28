import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
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
  );
}

export default Home;
