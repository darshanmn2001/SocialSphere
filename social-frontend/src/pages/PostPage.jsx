import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { postApi } from '../api/api';
import { Upload, PlusSquare, CheckCircle, AlertCircle, X, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PostPage() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setImage(file);
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) { setError('Please add a caption.'); return; }
    if (!image) { setError('Please select an image.'); return; }

    setLoading(true);
    setError('');
    setSuccess('');

    const fd = new FormData();
    fd.append('caption', caption);
    fd.append('image', image);

    try {
      await postApi.create(fd);
      setSuccess('Post shared successfully!');
      setTimeout(() => navigate('/home'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(124,58,237,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusSquare size={20} color="var(--text-accent)" />
            </div>
            <h1>New Post</h1>
          </div>
          <p>Share a moment with your connections</p>
        </div>

        <div style={{ maxWidth: 600 }}>
          {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
          {success && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="form-group">
              <label>Photo</label>
              {!preview ? (
                <div
                  className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon">
                    <Upload size={24} />
                  </div>
                  <h3>Drop your image here</h3>
                  <p>or click to browse — PNG, JPG, WEBP up to 10MB</p>
                </div>
              ) : (
                <div className="upload-preview" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 32, height: 32,
                      background: 'rgba(0,0,0,0.7)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'white'
                    }}
                  >
                    <X size={16} />
                  </button>
                  <div style={{
                    position: 'absolute', bottom: 12, left: 12,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    color: 'white',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <Image size={12} />
                    {image?.name}
                  </div>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="form-group">
              <label>Caption</label>
              <textarea
                className="form-control"
                placeholder="Write a caption for your post..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                maxLength={500}
                style={{ resize: 'vertical', minHeight: 100 }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                {caption.length}/500
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center', padding: '14px 24px' }}
              >
                {loading ? <div className="spinner" /> : <Upload size={17} />}
                {loading ? 'Sharing...' : 'Share Post'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                style={{ padding: '14px 24px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
