import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [tagsLoading, setTagsLoading] = useState(true);
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

    // Attempt to fetch comments for this post
    fetch(`/wp-json/wp/v2/comments?post=${id}`)
      .then((res) => {
        if (!res.ok) {
           throw new Error('Could not fetch comments.');
        }
        return res.json();
      })
      .then((data) => {
        setComments(data);
        setCommentsLoading(false);
      })
      .catch((err) => {
        console.error("Comments error:", err);
        setCommentsLoading(false);
      });

    // Attempt to fetch tags for this post
    fetch(`/wp-json/wp/v2/tags?post=${id}`)
      .then((res) => {
        if (!res.ok) {
           throw new Error('Could not fetch tags.');
        }
        return res.json();
      })
      .then((data) => {
        setTags(data);
        setTagsLoading(false);
      })
      .catch((err) => {
        console.error("Tags error:", err);
        setTagsLoading(false);
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
        <div className="single-post-meta">
            <span>By <Link to={`/author/${post.author}`} className="author-link">Author {post.author}</Link></span>
        </div>
      </header>
      <div className="single-post-content" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

      {/* Post Tags */}
      {!tagsLoading && tags.length > 0 && (
          <div className="post-tags">
              <strong>Tags: </strong>
              <ul className="tag-list">
                  {tags.map(tag => (
                      <li key={tag.id}>
                          <Link to={`/tag/${tag.id}`} className="tag-link">#{tag.name}</Link>
                      </li>
                  ))}
              </ul>
          </div>
      )}

      {/* Post Comments */}
      <section className="comments-section">
        <h3>Comments</h3>
        {commentsLoading && <p>Loading comments...</p>}
        {!commentsLoading && comments.length === 0 && <p>No comments yet.</p>}
        {!commentsLoading && comments.length > 0 && (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment-meta">
                  <strong>{comment.author_name}</strong> says:
                </div>
                <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

export default SinglePost;
