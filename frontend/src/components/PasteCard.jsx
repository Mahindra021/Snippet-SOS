import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './Toast';
import api from '../services/api';

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const isExpired = (expiresAt) => expiresAt && new Date(expiresAt) < new Date();

const PasteCard = ({ snippet, onDeleted, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${snippet.title}"?`)) return;
    try {
      await api.delete(`/pastes/${snippet._id}`);
      addToast('Snippet deleted', 'success');
      onDeleted(snippet._id);
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    addToast('Copied to clipboard!', 'success');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/snippet/${snippet._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: snippet.title, url });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }
    navigator.clipboard.writeText(url);
    addToast('Share link copied!', 'success');
  };

  const handleFavorite = async () => {
    try {
      const res = await api.patch(`/pastes/${snippet._id}/favorite`);
      onToggleFavorite(snippet._id, res.data.isFavorite);
    } catch {
      addToast('Could not update favorite', 'error');
    }
  };

  const expired = isExpired(snippet.expiresAt);

  return (
    <div className="card snippet-card" style={{ opacity: expired ? 0.55 : 1 }}>
      <div className="snippet-card-header">
        <div>
          <div
            className="snippet-card-title"
            onClick={() => !expired && navigate(`/snippet/${snippet._id}`)}
          >
            {snippet.title}
            {expired && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--red)' }}>[expired]</span>}
          </div>
          <div className="snippet-card-meta">
            <span>{formatDate(snippet.createdAt)}</span>
            {snippet.expiresAt && !expired && (
              <span>Expires {formatDate(snippet.expiresAt)}</span>
            )}
            <span className={`badge ${snippet.isPublic ? 'badge-public' : 'badge-private'}`}>
              {snippet.isPublic ? '⌑ public' : '⊘ private'}
            </span>
            {snippet.isFavorite && <span className="badge badge-star">★ favorites</span>}
          </div>
        </div>
        <button
          className="btn btn-ghost btn-icon"
          onClick={handleFavorite}
          title={snippet.isFavorite ? 'Unstar' : 'Star'}
          style={{ color: snippet.isFavorite ? 'var(--yellow)' : 'var(--text-muted)', flexShrink: 0 }}
        >
          {snippet.isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="snippet-card-preview">{snippet.content}</div>

      {snippet.tags?.length > 0 && (
        <div className="snippet-card-tags">
          {snippet.tags.map((tag) => (
            <span key={tag} className="tag-badge">{tag}</span>
          ))}
        </div>
      )}

      <div className="snippet-card-actions">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/snippet/${snippet._id}`)}>
          View
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/edit/${snippet._id}`)}>
          Edit
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
          Copy
        </button>
        <button className="btn btn-secondary btn-sm" onClick={handleShare}>
          Share
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PasteCard;
