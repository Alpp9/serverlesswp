import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="not-found-page">
      <h2 className="search-title">404 - Page Not Found</h2>
      <p className="status-message">The page you are looking for does not exist.</p>
      <div className="back-link-container" style={{ marginTop: '2rem' }}>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          &larr; Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
