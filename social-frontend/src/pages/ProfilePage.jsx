import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Camera, Save, CheckCircle, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    username: user?.name || '',
    gender: '',
    age: '',
    bio: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

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
    setLoading(true);
    setError(''); setSuccess('');
    // Simulate save (would call profileApi.update)
    await new Promise(r => setTimeout(r, 900));
    setSuccess('Profile updated successfully!');
    setLoading(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const gradient = 'linear-gradient(135deg,#7c3aed,#06b6d4)';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* Profile Hero */}
        <div className="profile-hero">
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(124,58,237,0.5)' }} />
            ) : (
              <div className="avatar avatar-xl" style={{ background: gradient }}>
                {getInitials(user?.name)}
              </div>
            )}
            <label style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32,
              background: 'var(--accent-primary)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid var(--bg-base)'
            }}>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              <Camera size={14} color="white" />
            </label>
          </div>

          {/* Info */}
          <div className="profile-info">
            <h1>{user?.name || 'Your Name'}</h1>
            <div className="meta">
              {user?.email && <span><Mail size={14} />{user.email}</span>}
              {form.gender && <span><User size={14} />{form.gender}</span>}
              {form.age && <span><MapPin size={14} />Age {form.age}</span>}
            </div>
            {form.bio && <p style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 500 }}>{form.bio}</p>}
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignSelf: 'flex-start' }}>
            <span className="badge badge-purple">Member</span>
            <span className="badge badge-cyan">Active</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
          {['info', 'edit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: activeTab === tab ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: activeTab === tab ? 'var(--text-accent)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'var(--transition)',
                fontFamily: 'var(--font-body)',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'info' ? 'Profile Info' : 'Edit Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="fade-in" style={{ maxWidth: 600 }}>
            <div className="card">
              <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Account Details</h3>
              <div style={{ display: 'grid', gap: 20 }}>
                {[
                  { label: 'Username', value: user?.name || '—', icon: User },
                  { label: 'Email', value: user?.email || '—', icon: Mail },
                  { label: 'Phone', value: user?.phoneNumber || '—', icon: Phone },
                  { label: 'Gender', value: form.gender || '—', icon: User },
                  { label: 'Age', value: form.age || '—', icon: User },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ width: 36, height: 36, background: 'rgba(124,58,237,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="var(--text-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edit' && (
          <div className="fade-in" style={{ maxWidth: 560 }}>
            {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
            {success && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

            <div className="card">
              <h3 style={{ marginBottom: 24, fontSize: '1.1rem' }}>Edit Your Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Your display name"
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      className="form-control"
                      value={form.gender}
                      onChange={handleChange}
                      style={{ appearance: 'none' }}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      name="age"
                      type="number"
                      className="form-control"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="Your age"
                      min={13}
                      max={120}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell people a little about yourself..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? <div className="spinner" /> : <Save size={17} />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
