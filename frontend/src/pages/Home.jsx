import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PasteCard from '../components/PasteCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [snippets, setPastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    const fetchPastes = async () => {
      try {
        const res = await api.get('/pastes');
        setPastes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPastes();
  }, []);

  const handleDeleted = (id) => {
    setPastes((prev) => prev.filter((p) => p._id !== id));
  };

  const handleToggleFavorite = (id, isFavorite) => {
    setPastes((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isFavorite } : p))
    );
  };

  const filtered = snippets.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchFav = !showFavorites || p.isFavorite;
    const matchTag = !filterTag || p.tags?.includes(filterTag);
    return matchSearch && matchFav && matchTag;
  });

  const allTags = [...new Set(snippets.flatMap((p) => p.tags || []))];

  if (!user) {
    return (
      <div className="container page-wrapper">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Welcome to Snippet SOS</div>
          <p className="empty-state-sub">
            Save, share, and organize your code snippets and notes.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Get started</Link>
            <Link to="/public" className="btn btn-secondary">Browse public snippets</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Snippets</h1>
          <p className="page-subtitle">{snippets.length} snippet{snippets.length !== 1 ? 's' : ''} total</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} />
          <Link to="/create" className="btn btn-primary">+ Create Snippet</Link>
        </div>
      </div>

      <div className="filter-bar">
        <button
          className={`toggle-btn ${!showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(false)}
        >
          All
        </button>
        <button
          className={`toggle-btn ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites(true)}
        >
          ★ Favorites
        </button>
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

      {loading ? (
        <div className="loading-center">
          <span className="spinner"></span> Loading your snippets…
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{search ? '🔍' : '📄'}</div>
          <div className="empty-state-title">
            {search ? 'No snippets match your search' : 'No snippets yet'}
          </div>
          <p className="empty-state-sub">
            {search ? 'Try a different search term.' : 'Create your first snippet to get started.'}
          </p>
          {!search && (
            <Link to="/create" className="btn btn-primary">Create snippet</Link>
          )}
        </div>
      ) : (
        <div className="snippets-grid">
          {filtered.map((snippet) => (
            <PasteCard
              key={snippet._id}
              snippet={snippet}
              onDeleted={handleDeleted}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
