import { useState } from 'react';

function CommentForm({ postId, onCommentSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/wp-json/wp/v2/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content: content,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to submit comment. WordPress might require authentication or it might be disabled.');
      }

      const newComment = await response.json();
      setStatus({ loading: false, error: null, success: true });
      setName('');
      setEmail('');
      setContent('');

      if (onCommentSubmitted) {
          onCommentSubmitted(newComment);
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h4>Leave a Reply</h4>
      {status.success && <p className="success-message">Comment submitted successfully! (It may require moderation).</p>}
      {status.error && <p className="error-message">{status.error}</p>}

      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Comment *</label>
        <textarea
          id="content"
          className="form-input"
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>

      <button type="submit" className="submit-btn btn-primary" disabled={status.loading}>
        {status.loading ? 'Submitting...' : 'Post Comment'}
      </button>
    </form>
  );
}

export default CommentForm;
