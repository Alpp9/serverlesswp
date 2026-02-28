import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt to fetch single post from WP REST API relative path
    fetch(`/wp-json/wp/v2/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch the post (perhaps it does not exist or DB is not setup).');
        }
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="status-message">Loading post from WordPress backend...</p>;

  if (error) {
    return (
      <div className="status-message error-message">
        <p>Error: {error}</p>
        <div className="back-link-container">
            <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!post) return <p className="status-message">Post not found.</p>;

  return (
    <article className="single-post">
      <div className="back-link-container">
        <Link to="/" className="back-link">&larr; Back to Dashboard</Link>
      </div>
      <header className="single-post-header">
        <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </header>
      <div className="single-post-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}

export default SinglePost;
