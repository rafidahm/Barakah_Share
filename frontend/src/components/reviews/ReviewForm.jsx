import { useState } from 'react';
import StarRating from './StarRating';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

export default function ReviewForm({ itemId, onSuccess }) {
  const { addReview } = useApp();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (comment.trim().length < 5) { setError('Comment must be at least 5 characters.'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    // TODO: REST API Integration — POST /api/reviews with JWT auth header
    addReview({ item_id: itemId, reviewer_id: currentUser._id, rating, comment: comment.trim() });
    toast.success('Review Added ✓', 'Thank you for your feedback!');
    setRating(0);
    setComment('');
    setLoading(false);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Your Rating *</label>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="review-comment">Your Comment *</label>
        <textarea
          id="review-comment"
          className="form-input"
          rows={3}
          placeholder="Share your experience with this item or its owner..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>
      {error && <p className="form-error" style={{ marginBottom: '0.75rem' }}>{error}</p>}
      <button type="submit" id="submit-review-btn" disabled={loading} className="btn btn-primary btn-sm">
        {loading ? <><span className="spinner" /> Submitting...</> : 'Submit Review'}
      </button>
    </form>
  );
}
