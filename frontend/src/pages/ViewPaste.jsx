import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

const formatDate = (d) => new Date(d).toLocaleString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

const ViewPaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [snippet, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/pastes/${id}`);
        setPaste(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load snippet');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCopy = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content);
    addToast('Copied to clipboard!', 'success');
  };

  const handleShare = async () => {
    const url = window.location.href;
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

  const handleDownload = () => {
    if (!snippet) return;
    const blob = new Blob([snippet.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Download started', 'info');
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${snippet.title}"?`)) return;
    try {
      await api.delete(`/pastes/${id}`);
      addToast('Snippet deleted', 'success');
      navigate('/');
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  if (loading) return <div className="loading-center"><span className="spinner"></span> Loading…</div>;

  if (error) {
    return (
      <div className="container page-wrapper">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <div className="empty-state-title">{error}</div>
          <p className="empty-state-sub">This snippet might be private or has expired.</p>
          <Link to="/" className="btn btn-secondary">Go home</Link>
        </div>
      </div>
    );
  }

  const isOwner = user && snippet.userId && (
    snippet.userId._id === user._id || snippet.userId === user._id
  );

  return (
    <div className="container page-wrapper">
      <div className="snippet-view-header">
        <h1 className="snippet-view-title">{snippet.title}</h1>
        <div className="snippet-view-meta">
          <span>by {snippet.userId?.name || 'Unknown'}</span>
          <span>·</span>
          <span>{formatDate(snippet.createdAt)}</span>
          {snippet.expiresAt && (
            <>
              <span>·</span>
              <span>Expires {formatDate(snippet.expiresAt)}</span>
            </>
          )}
          <span className={`badge ${snippet.isPublic ? 'badge-public' : 'badge-private'}`}>
            {snippet.isPublic ? '⌑ public' : '⊘ private'}
          </span>
          {snippet.isFavorite && <span className="badge badge-star">★ favorites</span>}
        </div>

        {snippet.tags?.length > 0 && (
          <div className="snippet-card-tags" style={{ marginTop: 8 }}>
            {snippet.tags.map((tag) => (
              <span key={tag} className="tag-badge">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="snippet-view-actions">
        <button className="btn btn-secondary" onClick={handleCopy}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
        <button className="btn btn-secondary" onClick={handleShare}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
        <button className="btn btn-secondary" onClick={handleDownload}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download .txt
        </button>
        {isOwner && (
          <>
            <button className="btn btn-secondary" onClick={() => navigate(`/edit/${snippet._id}`)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>

      <div className="code-block">
        <div className="code-block-header">
          <span>{snippet.title}</span>
          <span>{snippet.content.split('\n').length} lines</span>
        </div>
        <div className="code-block-body">{snippet.content}</div>
      </div>
    </div>
  );
};

export default ViewPaste;
