import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/api';
import { PlusSquare, ImageOff, Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg,#7c3aed,#06b6d4)',
    'linear-gradient(135deg,#f43f5e,#f59e0b)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
  ];
  if (!name) return gradients[0];
  return gradients[name.charCodeAt(0) % gradients.length];
}

function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article className="post-card fade-in">
      <div className="post-card-header">
        <div className="avatar" style={{ background: getAvatarGradient(post.authorName) }}>
          {getInitials(post.authorName)}
        </div>
        <div className="post-card-user">
          <div className="username">{post.authorName || 'Unknown User'}</div>
          <div className="time">{post.createdAt || 'Recently'}</div>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="post-card-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div className="post-card-body">
        {post.caption && <p className="post-card-caption">{post.caption}</p>}
        <div className="post-card-actions">
          <button
            className="post-action-btn"
            onClick={() => setLiked(l => !l)}
            style={liked ? { background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' } : {}}
          >
            <Heart size={15} fill={liked ? '#f43f5e' : 'none'} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>
          <button className="post-action-btn">
            <MessageCircle size={15} />
            <span>Comment</span>
          </button>
          <button
            className="post-action-btn"
            onClick={() => setSaved(s => !s)}
            style={saved ? { background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', color: 'var(--text-accent)' } : {}}
          >
            <Bookmark size={15} fill={saved ? 'var(--text-accent)' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postApi.getAll()
      .then(res => setPosts(res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
            fontSize: 80, opacity: 0.08, fontFamily: 'var(--font-display)', fontWeight: 800,
            pointerEvents: 'none', userSelect: 'none'
          }}>SOCIAL</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 6 }}>
            {greeting},
          </p>
          <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>
            Welcome back, <span className="gradient-text">{user?.name || 'User'}</span> 👋
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/post" className="btn btn-primary">
              <PlusSquare size={16} />
              New Post
            </Link>
            <Link to="/feeds" className="btn btn-secondary">
              Explore Feed →
            </Link>
          </div>
        </div>

        {/* Section header */}
        <div className="section-header">
          <h2>Recent Posts</h2>
          {posts.length > 0 && (
            <span className="badge badge-purple">{posts.length} posts</span>
          )}
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ height: 200, animation: 'none', opacity: 0.4 }} />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post, i) => (
              <PostCard key={post.id || i} post={post} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ImageOff />
            <h3>No posts yet</h3>
            <p>Be the first to share something! Click "New Post" to get started.</p>
            <Link to="/post" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
              <PlusSquare size={16} /> Create Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
