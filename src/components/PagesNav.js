import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PagesNav() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/wp-json/wp/v2/pages')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPages(data))
      .catch(err => console.error("Error loading pages:", err));
  }, []);

  if (pages.length === 0) return null;

  return (
    <nav className="nav-dropdown">
      <span className="nav-dropdown-title">Pages</span>
      <ul className="nav-dropdown-menu">
        {pages.map(page => (
          <li key={page.id}>
            <Link to={`/page/${page.id}`} dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default PagesNav;
