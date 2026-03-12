import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { connectionApi } from '../api/api';
import { Users, UserPlus, UserMinus, UserCheck, AlertCircle, CheckCircle, Search } from 'lucide-react';

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getGradient(name) {
  const g = ['linear-gradient(135deg,#7c3aed,#06b6d4)','linear-gradient(135deg,#f43f5e,#f59e0b)','linear-gradient(135deg,#10b981,#3b82f6)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#f59e0b,#ef4444)'];
  if (!name) return g[0];
  return g[name.charCodeAt(0) % g.length];
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const loadData = () => {
    setLoading(true);
    connectionApi.getAll()
      .then(res => {
        setConnections(res.data.connections || []);
        setAvailableUsers(res.data.availableUsers || []);
      })
      .catch(() => setError('Failed to load connections.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleConnect = async (userId, name) => {
    setActionLoading(a => ({ ...a, [userId]: true }));
    setError(''); setSuccess('');
    try {
      await connectionApi.connect(userId);
      setSuccess(`Connected with ${name}!`);
      loadData();
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setActionLoading(a => ({ ...a, [userId]: false }));
    }
  };

  const handleDisconnect = async (connectionId, name) => {
    setActionLoading(a => ({ ...a, [connectionId]: true }));
    setError(''); setSuccess('');
    try {
      await connectionApi.disconnect(connectionId);
      setSuccess(`Disconnected from ${name}.`);
      loadData();
    } catch {
      setError('Failed to disconnect. Please try again.');
    } finally {
      setActionLoading(a => ({ ...a, [connectionId]: false }));
    }
  };

  const filteredAvailable = availableUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(16,185,129,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--accent-emerald)" />
            </div>
            <h1>Connections</h1>
          </div>
          <p>Manage your network and discover new people</p>
        </div>

        {error && <div className="alert alert-error"><AlertCircle size={16} />{error}</div>}
        {success && <div className="alert alert-success"><CheckCircle size={16} />{success}</div>}

        {/* Stats */}
        <div className="stats-row" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-value gradient-text">{connections.length}</div>
            <div className="stat-label">Connections</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient-text">{availableUsers.length}</div>
            <div className="stat-label">To Discover</div>
          </div>
          <div className="stat-card">
            <div className="stat-value gradient-text">{connections.length + availableUsers.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="card" style={{ height: 72, opacity: 0.4 }} />
            ))}
          </div>
        ) : (
          <>
            {/* Current Connections */}
            <section style={{ marginBottom: 40 }}>
              <div className="section-header">
                <h2>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserCheck size={20} color="var(--accent-emerald)" />
                    My Connections
                    {connections.length > 0 && (
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                        {connections.length}
                      </span>
                    )}
                  </span>
                </h2>
              </div>

              {connections.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px' }}>
                  <Users />
                  <h3>No connections yet</h3>
                  <p>Start connecting with people below!</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {connections.map((conn, i) => {
                    const connectedName = conn.connectedUser?.name || conn.user?.name || 'Unknown';
                    return (
                      <div key={conn.id || i} className="connection-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="avatar" style={{ background: getGradient(connectedName) }}>
                          {getInitials(connectedName)}
                        </div>
                        <div className="connection-info">
                          <div className="name">{connectedName}</div>
                          <div className="status" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
                            Connected
                          </div>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDisconnect(conn.id, connectedName)}
                          disabled={actionLoading[conn.id]}
                          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                          {actionLoading[conn.id] ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <UserMinus size={14} />}
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Discover People */}
            <section>
              <div className="section-header">
                <h2>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserPlus size={20} color="var(--text-accent)" />
                    Discover People
                  </span>
                </h2>
              </div>

              {/* Search */}
              {availableUsers.length > 3 && (
                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: 38 }}
                    placeholder="Search people..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              )}

              {filteredAvailable.length === 0 ? (
                <div className="empty-state" style={{ padding: '36px 20px' }}>
                  <UserCheck />
                  <h3>You've connected with everyone!</h3>
                  <p>No new people to discover right now.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {filteredAvailable.map((u, i) => (
                    <div key={u.id || i} className="connection-card fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="avatar" style={{ background: getGradient(u.name) }}>
                        {getInitials(u.name)}
                      </div>
                      <div className="connection-info">
                        <div className="name">{u.name}</div>
                        <div className="status">{u.email || 'Member'}</div>
                      </div>
                      <button
                        className="btn btn-success"
                        onClick={() => handleConnect(u.id, u.name)}
                        disabled={actionLoading[u.id]}
                        style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                      >
                        {actionLoading[u.id] ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <UserPlus size={14} />}
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
