import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/Toast';
import TagInput from '../components/TagInput';
import api from '../services/api';

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

const EditPaste = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({ title: '', content: '', tags: [], isPublic: false, expiry: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const res = await api.get(`/pastes/${id}`);
        const p = res.data;
        setForm({
          title: p.title,
          content: p.content,
          tags: p.tags || [],
          isPublic: p.isPublic,
          expiry: '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load snippet');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchPaste();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        ...(form.expiry ? { expiresAt: calcExpiry(form.expiry) } : {}),
      };
      await api.put(`/pastes/${id}`, payload);
      addToast('Snippet updated!', 'success');
      navigate(`/snippet/${id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading-center">
        <span className="spinner"></span> Loading snippet…
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-wrapper">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Snippet</h1>
          <p className="page-subtitle">Update your snippet content, tags, or settings.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            className="form-textarea"
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
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
          <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
            <label className="form-label" htmlFor="expiry">Update Expiration (optional)</label>
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
            {loading ? <><span className="spinner"></span> Saving…</> : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPaste;
