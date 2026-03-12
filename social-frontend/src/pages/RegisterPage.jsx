import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/api';
import { UserPlus, Mail, Lock, Phone, User, Image, Zap, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phoneNumber: '', password: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phoneNumber) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('phoneNumber', form.phoneNumber);
    fd.append('password', form.password);
    if (photo) fd.append('photo', photo);

    try {
      await authApi.register(fd);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-orb auth-orb-1" style={{ animationDelay: '-2s' }} />
      <div className="auth-orb auth-orb-2" style={{ animationDelay: '-1s' }} />

      <div className="auth-panel">
        <div className="auth-card" style={{ maxWidth: 500 }}>
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Zap size={22} color="white" />
            </div>
            <span className="gradient-text">SocialSphere</span>
          </div>

          <h2>Create account</h2>
          <p className="subtitle">Join the community today — it's free</p>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label>Username</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    name="name"
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    placeholder="johndoe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    name="phoneNumber"
                    type="tel"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    placeholder="+1 234 567 8900"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: 38 }}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profile Photo (optional)</label>
              <div
                style={{
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  position: 'relative'
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 48, height: 48, background: 'rgba(124,58,237,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image size={20} color="var(--text-accent)" />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{photo ? photo.name : 'Click to upload photo'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PNG, JPG up to 5MB</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ marginTop: 4 }}
            >
              {loading ? <div className="spinner" /> : <UserPlus size={18} />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
