import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function SinglePage() {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Attempt to fetch single page from WP REST API relative path
    fetch(`/wp-json/wp/v2/pages/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not fetch the page (perhaps it does not exist).');
        }
        return res.json();
      })
      .then((data) => {
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="status-message">Loading page...</p>;

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

  if (!pageData) return <p className="status-message">Page not found.</p>;

  return (
    <article className="single-post">
      <header className="single-post-header">
        <h1 dangerouslySetInnerHTML={{ __html: pageData.title.rendered }} />
      </header>
      <div className="single-post-content" dangerouslySetInnerHTML={{ __html: pageData.content.rendered }} />
    </article>
  );
}

export default SinglePage;
