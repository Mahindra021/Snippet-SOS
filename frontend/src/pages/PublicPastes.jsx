import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import SearchBar from '../components/SearchBar';
import api from '../services/api';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
});

const PublicPastes = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [snippets, setPastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/pastes/public');
        setPastes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCopy = (snippet) => {
    navigator.clipboard.writeText(snippet.content);
    addToast('Copied to clipboard!', 'success');
  };

  const handleShare = async (snippet) => {
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

  const filtered = snippets.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchTag = !filterTag || p.tags?.includes(filterTag);
    return matchSearch && matchTag;
  });

  const allTags = [...new Set(snippets.flatMap((p) => p.tags || []))];

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Public Snippets</h1>
          <p className="page-subtitle">Browse publicly shared code snippets and notes from the community.</p>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {allTags.length > 0 && (
        <div className="filter-bar">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`toggle-btn ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
          {filterTag && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilterTag('')}>
              ✕ Clear
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading-center"><span className="spinner"></span> Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">
            {search ? 'No results found' : 'No public snippets yet'}
          </div>
          <p className="empty-state-sub">
            {search ? 'Try a different search.' : 'Be the first to share!'}
          </p>
        </div>
      ) : (
        <div className="snippets-grid">
          {filtered.map((snippet) => (
            <div key={snippet._id} className="card snippet-card">
              <div className="snippet-card-header">
                <div>
                  <div
                    className="snippet-card-title"
                    onClick={() => navigate(`/snippet/${snippet._id}`)}
                  >
                    {snippet.title}
                  </div>
                  <div className="snippet-card-meta">
                    <span>by {snippet.userId?.name || 'Unknown'}</span>
                    <span>{formatDate(snippet.createdAt)}</span>
                  </div>
                </div>
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
                <button className="btn btn-secondary btn-sm" onClick={() => handleCopy(snippet)}>
                  Copy
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleShare(snippet)}>
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPastes;
