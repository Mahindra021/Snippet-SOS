import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import TagInput from '../components/TagInput';
import api from '../services/api';

const DRAFT_KEY = 'cph_draft';

const EXPIRY_OPTIONS = [
  { label: 'Never', value: '' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
];

const calcExpiry = (option) => {
  if (!option) return null;
  const now = new Date();
  if (option === '1h') now.setHours(now.getHours() + 1);
  else if (option === '1d') now.setDate(now.getDate() + 1);
  else if (option === '7d') now.setDate(now.getDate() + 7);
  else if (option === '30d') now.setDate(now.getDate() + 30);
  return now.toISOString();
};

const CreatePaste = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft
      ? JSON.parse(draft)
      : { title: '', content: '', tags: [], isPublic: false, expiry: '' };
  });

  const [loading, setLoading] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const draftTimer = useRef(null);

  // Auto-save draft
  useEffect(() => {
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 800);
    return () => clearTimeout(draftTimer.current);
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      addToast('Title and content are required', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        tags: form.tags,
        isPublic: form.isPublic,
        expiresAt: calcExpiry(form.expiry),
      };
      const res = await api.post('/pastes', payload);
      localStorage.removeItem(DRAFT_KEY);
      addToast('Snippet created!', 'success');
      navigate(`/snippet/${res.data._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create snippet', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setForm({ title: '', content: '', tags: [], isPublic: false, expiry: '' });
    addToast('Draft cleared', 'info');
  };

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Snippet</h1>
          <p className="page-subtitle">Create a new code snippet, note, or any text content.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearDraft}>Clear draft</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            placeholder="Give your snippet a descriptive title"
            value={form.title}
            onChange={handleChange}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
            placeholder="Snippet your code, notes, or any text here..."
            value={form.content}
            onChange={handleChange}
            rows={18}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <TagInput
            tags={form.tags}
            onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
          />
          <p className="form-hint">Press Enter or comma to add a tag. Up to 10 tags.</p>
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
          <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
            <label className="form-label" htmlFor="expiry">Expiration</label>
            <select
              id="expiry"
              name="expiry"
              className="form-select"
              value={form.expiry}
              onChange={handleChange}
            >
              {EXPIRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
            <label className="form-label">Visibility</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${!form.isPublic ? 'active' : ''}`}
                onClick={() => setForm((p) => ({ ...p, isPublic: false }))}
              >
                ⊘ Private
              </button>
              <button
                type="button"
                className={`toggle-btn ${form.isPublic ? 'active' : ''}`}
                onClick={() => setForm((p) => ({ ...p, isPublic: true }))}
              >
                ⌑ Public
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating…</> : 'Create Snippet'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>

      <div className="draft-indicator">
        {draftSaved
          ? <><span className="dot-green"></span> Draft saved</>
          : <><span className="dot-yellow"></span> Auto-saving draft…</>
        }
      </div>
    </div>
  );
};

export default CreatePaste;
