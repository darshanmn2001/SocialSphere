import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { feedApi } from '../api/api';
import { Rss, Heart, MessageCircle, Bookmark, MoreHorizontal, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarGradient(name) {
  const g = ['linear-gradient(135deg,#7c3aed,#06b6d4)','linear-gradient(135deg,#f43f5e,#f59e0b)','linear-gradient(135deg,#10b981,#3b82f6)','linear-gradient(135deg,#8b5cf6,#ec4899)'];
  if (!name) return g[0];
  return g[name.charCodeAt(0) % g.length];
}

function FeedCard({ post, index }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 1);

  return (
    <article className="post-card fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
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
          style={{ maxHeight: 420 }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div className="post-card-body">
        {post.caption && (
          <p className="post-card-caption">
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.authorName} </span>
            {post.caption}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="post-card-actions">
            <button
              className="post-action-btn"
              onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }}
              style={liked ? { background: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' } : {}}
            >
              <Heart size={15} fill={liked ? '#f43f5e' : 'none'} />
              <span>{likes}</span>
            </button>
            <button className="post-action-btn">
              <MessageCircle size={15} />
              <span>{Math.floor(Math.random() * 10)}</span>
            </button>
          </div>
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

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: '40%', marginBottom: 6 }} />
          <div style={{ height: 11, background: 'var(--border)', borderRadius: 4, width: '25%' }} />
        </div>
      </div>
      <div style={{ height: 260, background: 'var(--border)' }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ height: 12, background: 'var(--border)', borderRadius: 4, width: '80%', marginBottom: 8 }} />
        <div style={{ height: 12, background: 'var(--border)', borderRadius: 4, width: '60%' }} />
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedApi.get()
      .then(res => setPosts(res.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(6,182,212,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rss size={20} color="var(--accent-secondary)" />
            </div>
            <h1>Your Feed</h1>
          </div>
          <p>Explore posts from people you follow</p>
        </div>

        {loading ? (
          <div className="posts-grid">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post, i) => <FeedCard key={post.id || i} post={post} index={i} />)}
          </div>
        ) : (
          <div className="empty-state">
            <ImageOff />
            <h3>Your feed is empty</h3>
            <p>Connect with people to see their posts here.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
              <Link to="/connections" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                Find Connections
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
