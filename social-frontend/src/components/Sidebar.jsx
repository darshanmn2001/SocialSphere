import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Rss, PlusSquare, Users, User, LogOut, Zap
} from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/feeds', icon: Rss, label: 'Feed' },
  { to: '/post', icon: PlusSquare, label: 'New Post' },
  { to: '/connections', icon: Users, label: 'Connections' },
  { to: '/profile', icon: User, label: 'Profile' },
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = [
    'linear-gradient(135deg,#7c3aed,#06b6d4)',
    'linear-gradient(135deg,#f43f5e,#f59e0b)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
  ];
  if (!name) return colors[0];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={20} color="white" />
        </div>
        <span className="sidebar-logo-text gradient-text">SocialSphere</span>
      </div>

      {/* Main Navigation */}
      <p className="sidebar-section-label">Navigation</p>
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <hr className="divider sidebar-divider" />

        <button className="sidebar-link" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      {/* User Info at bottom */}
      {user && (
        <div className="sidebar-user">
          <div
            className="avatar"
            style={{ background: getAvatarColor(user.name) }}
          >
            {getInitials(user.name)}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{user.name}</div>
            <div className="role">Member</div>
          </div>
        </div>
      )}
    </aside>
  );
}
