import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CategoriesNav() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/wp-json/wp/v2/categories?hide_empty=true')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data))
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  if (categories.length === 0) return null;

  return (
    <nav className="nav-dropdown">
      <span className="nav-dropdown-title">Categories</span>
      <ul className="nav-dropdown-menu">
        {categories.map(cat => (
          <li key={cat.id}>
            <Link to={`/category/${cat.id}`} dangerouslySetInnerHTML={{ __html: cat.name }} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoriesNav;
